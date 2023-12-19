// import { testInput as input } from "./19-input";
import { input } from "./19-input";

export function doIt(progress: (...params: any[]) => void) {
  const [rulesInput, partsInput] = input.split(`\n\n`);
  const rulesArray = rulesInput.split(`\n`).map((r) => {
    const [_, name, rs] = r.match(/(.+)\{(.+)\}/)!;
    const rules = rs.split(`,`).map((r) => {
      const [first, second] = r.split(`:`);
      if (second) {
        return {
          target: second,
          category: first[0],
          op: first[1],
          value: +first.slice(2),
        };
      } else {
        return { target: first, op: undefined };
      }
    });
    return { name, rules };
  });
  const rules = rulesArray.reduce((a, r) => {
    a[r.name] = r.rules;
    return a;
  }, {} as Record<string, (typeof rulesArray)[number]["rules"]>);
  const parts = partsInput.split(`\n`).map((p) => {
    const [_, ps] = p.match(/\{(.+)\}/)!;
    return ps.split(`,`).reduce((a, p) => {
      const [name, value] = p.split(`=`);
      a[name] = +value;
      return a;
    }, {} as Record<string, number>);
  });

  const first = parts
    .filter(clasify)
    .map((p) => p["x"] + p["m"] + p["a"] + p["s"])
    .reduce((a, b) => a + b, 0);
  const second = clasify2({
    x: { from: 1, to: 4000 },
    m: { from: 1, to: 4000 },
    a: { from: 1, to: 4000 },
    s: { from: 1, to: 4000 },
  })
    .map(
      (r) =>
        (r.x.to - r.x.from + 1) *
        (r.m.to - r.m.from + 1) *
        (r.a.to - r.a.from + 1) *
        (r.s.to - r.s.from + 1)
    )
    .reduce((a, b) => a + b, 0);
  console.log(first, second);

  function clasify(part: Record<string, number>) {
    let current = rules["in"];
    while (true) {
      const next = current.find((r) => {
        if (r.op === undefined) return true;
        if (r.op === "<" && part[r.category] < r.value) return true;
        if (r.op === ">" && part[r.category] > r.value) return true;
      })!.target;
      if (next === "A") return true;
      if (next === "R") return false;
      current = rules[next];
    }
  }

  function clasify2(
    range: Range,
    ruleName: string = "in",
    visitedRules: string[] = []
  ): Range[] {
    if (ruleName === "A") {
      // console.log(visitedRules.join(", "), range);
      return [range];
    }
    if (ruleName === "R") return [];
    visitedRules = [...visitedRules, ruleName];
    let current = rules[ruleName];
    let ranges: Range[] = [];
    for (let i = 0; i < current.length; i++) {
      const rule = current[i];
      switch (rule.op) {
        case undefined:
          ranges.push(...clasify2(range, rule.target, visitedRules));
          return ranges;
        case "<": {
          const subrange = range[rule.category];
          if (subrange.to < rule.value) {
            ranges.push(...clasify2(range, rule.target, visitedRules));
            return ranges;
          }
          if (subrange.from >= rule.value) break;
          ranges.push(
            ...clasify2(
              {
                ...range,
                [rule.category]: { from: subrange.from, to: rule.value - 1 },
              },
              rule.target,
              visitedRules
            )
          );
          range = {
            ...range,
            [rule.category]: { from: rule.value, to: subrange.to },
          };
          break;
        }
        case ">": {
          const subrange = range[rule.category];
          if (subrange.from > rule.value) {
            ranges.push(...clasify2(range, rule.target, visitedRules));
            return ranges;
          }
          if (subrange.to <= rule.value) break;
          ranges.push(
            ...clasify2(
              {
                ...range,
                [rule.category]: { from: rule.value + 1, to: subrange.to },
              },
              rule.target,
              visitedRules
            )
          );
          range = {
            ...range,
            [rule.category]: { from: subrange.from, to: rule.value },
          };
          break;
        }
      }
    }
    return ranges;
  }
}

type Range = Record<string, { from: number; to: number }>;
