// import { testInput as input } from "./24-input";
import { input } from "./24-input";
import { IPosition } from "./utils/positions3D";

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
  const second = parsed.length;
  console.log(first, second);
}

type Line = { pos: IPosition; slope: IPosition };

function intersects2D(a: Line, b: Line) {
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
  return { x: bx + bsx * u, y: by + bsy * u };
}

function inRange(a: number, b: number, c: number) {
  return a <= b && b <= c;
}
