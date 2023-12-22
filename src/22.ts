// import { testInput as input } from "./22-input";
import { input } from "./22-input";
import { IPosition, posToString } from "./utils/positions3D";
import { isDefined } from "./utils/util";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input
    .split(`\n`)
    .map((line) => {
      const [start, end] = line.split("~").map((v) => {
        const [x, y, z] = v.split(",").map((v) => +v);
        return { x, y, z };
      });
      return expand(start, end);
    })
    .sort((a, b) => a[0].z - b[0].z);
  const map = new Map<string, number>();
  const blockSupports = new Map<number, number[]>();

  parsed.forEach((block, i) => {
    while (true) {
      const downProjection = fallDown(block);
      if (inferesWithGround(downProjection)) {
        block.forEach((pos) => map.set(posToString(pos), i));
        break;
      }
      const standsOn = inferesWith(map, downProjection);
      if (standsOn.length) {
        block.forEach((pos) => map.set(posToString(pos), i));
        blockSupports.set(i, [...new Set(standsOn)]);
        break;
      }
      block = downProjection;
    }
  });
  const cannotRemove = new Set(
    [...blockSupports.values()].filter((v) => v.length === 1).map((v) => v[0])
  );
  let second = 0;
  for (let i = 0; i < parsed.length; i++) {
    const removed = new Set([i]);
    let prevRemoved = 0;
    while (removed.size !== prevRemoved) {
      prevRemoved = removed.size;
      [...blockSupports.entries()].forEach(([k, v]) => {
        if (v.every((s) => removed.has(s))) {
          removed.add(k);
        }
      });
    }
    second += removed.size - 1;
  }

  const first = parsed.length - cannotRemove.size;
  console.log(first, second);
}

function expand(start: IPosition, end: IPosition) {
  const block: IPosition[] = [];
  const xRange = range(start, end, "x");
  const yRange = range(start, end, "y");
  const zRange = range(start, end, "z");
  for (let x = xRange[0]; x <= xRange[1]; x++) {
    for (let y = yRange[0]; y <= yRange[1]; y++) {
      for (let z = zRange[0]; z <= zRange[1]; z++) {
        block.push({ x, y, z });
      }
    }
  }
  return block;
}

function range(start: IPosition, end: IPosition, coord: keyof IPosition) {
  const c1 = start[coord];
  const c2 = end[coord];
  return c1 < c2 ? [c1, c2] : [c2, c1];
}

function fallDown(block: IPosition[]) {
  return block.map((pos) => ({ ...pos, z: pos.z - 1 }));
}

function inferesWithGround(block: IPosition[]) {
  return block.some((pos) => pos.z === 0);
}

function inferesWith(map: Map<string, number>, block: IPosition[]) {
  return block.map((pos) => map.get(posToString(pos))).filter(isDefined);
}
