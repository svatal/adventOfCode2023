// import { testInput as input } from "./24-input";
import { input } from "./24-input";
import { IPosition } from "./utils/positions3D";
import { isDefined } from "./utils/util";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => {
    const [pos, slope] = line.split(" @ ").map((s) => {
      const [x, y, z] = s.split(", ").map(Number);
      return { x, y, z };
    });
    return { pos, slope };
  });
  let first = 0;
  // const rangeStart = 7;
  // const rangeEnd = 27;
  const rangeStart = 200000000000000;
  const rangeEnd = 400000000000000;
  parsed.forEach((line, idx1) => {
    const others = parsed.slice(idx1 + 1);
    others.forEach((other, idx2) => {
      const intersection = intersects2D(line, other);
      if (
        intersection &&
        inRange(rangeStart, intersection.x, rangeEnd) &&
        inRange(rangeStart, intersection.y, rangeEnd)
      ) {
        first++;
      }
    });
  });
  console.log(first);

  const slopeXCandidates = getSlopeCandidates(parsed, "x");
  const slopeYCandidates = getSlopeCandidates(parsed, "y");
  const slopeZCandidates = getSlopeCandidates(parsed, "z");
  for (let slopeX of slopeXCandidates)
    for (let slopeY of slopeYCandidates)
      for (let slopeZ of slopeZCandidates) {
        const p2 = parsed.map(({ pos, slope }) => ({
          pos,
          slope: {
            x: slope.x - slopeX,
            y: slope.y - slopeY,
            z: slope.z - slopeZ,
          },
        }));
        let intersection: IPosition | undefined = undefined;
        let failed = false;
        for (let i = 1; i < p2.length; i++) {
          const candidate = intersects3D(p2[0], p2[i]);
          if (candidate === undefined) {
            failed = true;
          } else if (intersection === undefined) {
            intersection = candidate;
          } else {
            if (
              intersection.x !== candidate.x ||
              intersection.y !== candidate.y ||
              intersection.z !== candidate.z
            ) {
              failed = true;
            }
          }
        }
        if (intersection)
          console.log(
            slopeX,
            slopeY,
            slopeZ,
            intersection,
            intersection.x + intersection.y + intersection.z
          );
      }
}

type Line = { pos: IPosition; slope: IPosition };

function intersects2D(a: Line, b: Line) {
  return intersects2DInt(a, b)?.pos;
}

function intersects2DInt(a: Line, b: Line) {
  const { x: ax, y: ay } = a.pos;
  const { x: bx, y: by } = b.pos;
  const { x: asx, y: asy } = a.slope;
  const { x: bsx, y: bsy } = b.slope;
  const d = asx * bsy - asy * bsx;
  if (d === 0) {
    // console.log("parallel");
    // todo - check if they are same line .. actually not needed
    return undefined;
  }
  const t = ((ay - by) * bsx - (ax - bx) * bsy) / d;
  const u = ((by - ay) * asx - (bx - ax) * asy) / -d;
  if (t < 0 || u < 0) {
    // console.log("in the past");
    return undefined;
  }
  return { pos: { x: bx + bsx * u, y: by + bsy * u }, t, u };
}

function intersects3D(a: Line, b: Line) {
  const p = intersects2DInt(a, b);
  if (p === undefined) return undefined;
  const az = a.pos.z + a.slope.z * p.t;
  const bz = b.pos.z + b.slope.z * p.u;
  if (az !== bz) return undefined;
  return { ...p.pos, z: az };
}

function inRange(a: number, b: number, c: number) {
  return a <= b && b <= c;
}

function getSlopeCandidates(lines: Line[], key: keyof IPosition) {
  const map = new Map<number, number[]>();
  lines.forEach((line) => {
    const value = line.slope[key];
    const group = map.get(value) ?? [];
    group.push(line.pos[key]);
    map.set(value, group);
  });
  const diffs = [...map.entries()]
    .filter((vs) => vs.length > 1)
    .map((vs) => ({ key: vs[0], values: vs[1].sort((a, b) => a - b) }))
    .map(({ key, values }) => {
      const diffs = values
        .slice(1)
        .map((v, i) => v - values[i])
        .filter((v) => v > 1);
      return { key, diffs };
    });
  return diffs
    .map(({ key, diffs }) =>
      diffs.map(
        (diff) =>
          new Set(
            getAllDivisors(diff, 2000)
              .map((d) => [key + d, key - d])
              .flat()
          )
      )
    )
    .flat()
    .reduce(setIntersection);
}

function getAllDivisors(n: number, max: number) {
  const divisors = [];
  max = Math.min(max, n / 2);
  for (let i = 1; i <= max; i++) {
    if (n % i === 0) {
      divisors.push(i);
    }
  }
  return divisors;
}

function setIntersection(a: Set<number>, b: Set<number>) {
  return new Set([...a].filter((x) => b.has(x)));
}
