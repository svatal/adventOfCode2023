// import { testInput as input } from "./20-input";
import { input } from "./20-input";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => {
    const [name, outputsS] = line.split(" -> ");
    const outputs = outputsS.split(", ");
    return {
      type: name[0],
      name: name === "broadcaster" ? name : name.slice(1),
      outputs,
    };
  });
  const modules = parsed.reduce((acc, cur) => {
    acc[cur.name] = cur;
    return acc;
  }, {} as Record<string, (typeof parsed)[number]>);
  const flipFlopMemory = new Map<string, boolean>(
    parsed.filter((v) => v.type === "%").map((v) => [v.name, false])
  );
  const conjunctionMemory = new Map<string, Map<string, boolean>>();
  parsed.forEach((module) => {
    module.outputs.forEach((outputName) => {
      const output = modules[outputName];
      if (!output) return; // "output"
      if (output.type === "&") {
        const memory = conjunctionMemory.get(outputName) ?? new Map();
        memory.set(module.name, false);
        conjunctionMemory.set(outputName, memory);
      }
    });
  });
  const directInputs = new Map<string, Set<string>>();
  parsed.forEach((module) => {
    module.outputs.forEach((outputName) => {
      const entry = directInputs.get(outputName) ?? new Set();
      entry.add(module.name);
      directInputs.set(outputName, entry);
    });
  });
  const transitiveInputs = new Map<string, Set<string>>(
    [...directInputs.entries()].map(([k, v]) => [k, new Set(v)])
  );
  transitiveInputs.forEach((v, k) => {
    let prevCount = 0;
    while (v.size > prevCount) {
      prevCount = v.size;
      v.forEach((name) => {
        const entry = transitiveInputs.get(name);
        if (entry) entry.forEach((e) => v.add(e));
      });
    }
    // console.log(k, [...v].join(", "));
  });

  const cache = new Map<string, { closed: boolean; values: boolean[] }>(
    [...flipFlopMemory.keys()].map((name) => [
      name,
      { closed: false, values: [] },
    ])
  );

  const signalCounter = { false: 0, true: 0 };
  let pressed = 0;
  let first = 0;
  const flips = new Map<string, number[]>();
  const importantConjunctions = ["nh", "mf", "fd", "kb"];
  const conjunctionsReached = new Map<string, number>();
  while ([...cache.values()].some((v) => !v.closed)) {
    pressed++;
    const signals = [{ name: "broadcaster", high: false, source: "button" }];
    while (signals.length) {
      const signal = signals.shift()!;
      signalCounter[`${signal.high}`]++;
      const module = modules[signal.name];
      switch (module?.type) {
        case "b":
          signals.push(
            ...module.outputs.map((name) => ({
              name,
              high: signal.high,
              source: module.name,
            }))
          );
          break;
        case "%": {
          if (signal.high) break;
          const flip = flips.get(module.name) ?? [];
          flip.push(pressed);
          if (flip.length > 100) flip.shift();
          flips.set(module.name, flip);
          const wasOn = flipFlopMemory.get(module.name) ?? false;
          signals.push(
            ...module.outputs.map((name) => ({
              name,
              high: !wasOn,
              source: module.name,
            }))
          );
          flipFlopMemory.set(module.name, !wasOn);
          break;
        }
        case "&": {
          const memory = conjunctionMemory.get(module.name)!;
          memory.set(signal.source, signal.high);
          const allHigh = [...memory.values()].every((v) => v);
          if (allHigh && importantConjunctions.includes(module.name))
            conjunctionsReached.set(module.name, pressed);
          signals.push(
            ...module.outputs.map((name) => ({
              name,
              high: !allHigh,
              source: module.name,
            }))
          );
          break;
        }
      }
    }
    flipFlopMemory.forEach((v, k) => {
      const c = cache.get(k)!;
      if (c.closed) return;
      if (
        [...transitiveInputs.get(k)!]
          .map((name) => flipFlopMemory.get(name) ?? false)
          .every((v) => v === false)
      ) {
        c.closed = true;
        return;
      }
      c.values.push(v);
    });
    if (pressed === 1000) first = signalCounter.false * signalCounter.true;
  }

  const second = [...conjunctionsReached.values()].reduce((a, b) => a * b, 1);
  console.log(first, second);
}
