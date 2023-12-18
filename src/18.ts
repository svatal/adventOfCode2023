// import { testInput as input } from "./18-input";
import { input } from "./18-input";
import {
  Direction,
  directionToOrientation,
  followDirection,
} from "./utils/position2D";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => {
    const [_, dir, steps, color] = line.match(/(.) (\d+) \((.+)\)/)!;
    return { dir: toDirection(dir), steps: +steps, color } as const;
  });
  const first = countInside(dig(parsed));
  const dirs = ["R", "D", "L", "U"];
  const repaired = parsed.map(({ color }) => {
    const [_, hexSteps, dir] = color.match(/#(.{5})(.)/)!;
    return {
      dir: toDirection(dirs[+dir]),
      steps: parseInt(hexSteps, 16),
    } as const;
  });
  const second = countInside(dig(repaired));
  console.log(first, second);
}

function set(
  map: Map<number, Map<number, string>>,
  pos: { x: number; y: number },
  value: string
) {
  const row = map.get(pos.y) ?? new Map<number, string>();
  row.set(pos.x, value);
  map.set(pos.y, row);
}

function toDirection(dir: string) {
  switch (dir) {
    case "R":
      return ">";
    case "L":
      return "<";
    case "U":
      return "^";
    case "D":
      return "v";
    default:
      throw new Error(`Unknown direction ${dir}`);
  }
}

function turn(prevDirection: Direction, nextDirection: Direction) {
  if (
    (prevDirection === ">" && nextDirection === "^") ||
    (prevDirection === "v" && nextDirection === "<")
  ) {
    return "J";
  }
  if (
    (prevDirection === ">" && nextDirection === "v") ||
    (prevDirection === "^" && nextDirection === "<")
  ) {
    return "\\";
  }
  if (
    (prevDirection === "<" && nextDirection === "v") ||
    (prevDirection === "^" && nextDirection === ">")
  ) {
    return "/";
  }
  if (
    (prevDirection === "<" && nextDirection === "^") ||
    (prevDirection === "v" && nextDirection === ">")
  ) {
    return "L";
  }
  throw new Error(`Unknown turn from ${prevDirection} to ${nextDirection}`);
}

function countInside(p: {
  map: Map<number, Map<number, string>>;
  verticalRuns: { x: number; start: number; end: number }[];
}) {
  const { map, verticalRuns } = p;
  return [...map.entries()]
    .sort(([y1], [y2]) => y1 - y2)
    .map(([y, row], idx, sortedMap) => {
      let inside = countInsideRow([
        ...row.entries(),
        ...findVerticals(verticalRuns, y),
      ]);
      if (idx > 0) {
        const prevRowY = [...sortedMap][idx - 1][0];
        if (prevRowY + 1 < y) {
          const betweenRow = countInsideRow(findVerticals(verticalRuns, y - 1));
          inside += betweenRow * (y - prevRowY - 1);
        }
      }
      return inside;
    })
    .reduce((a, b) => a + b, 0);
}

function countInsideRow(row: [number, string][]) {
  const sorted = [...row].sort(([x1], [x2]) => x1 - x2);
  let inside = 0;
  let ups = 0;
  let downs = 0;
  sorted.forEach(([x, path], i) => {
    if (ups % 2 === 1 || downs % 2 === 1) {
      inside += x - sorted[i - 1][0];
    } else inside++;
    if (path === "|") {
      ups++;
      downs++;
    }
    if (path === "L" || path === "J") {
      ups++;
    }
    if (path === "/" || path === "\\") {
      downs++;
    }
  });
  return inside;
}

function findVerticals(
  verticalRuns: { x: number; start: number; end: number }[],
  y: number
): [number, string][] {
  return verticalRuns
    .filter(({ start, end }) => y > start && y < end)
    .map(({ x }) => [x, "|"]);
}

function dig(parsed: { dir: Direction; steps: number }[]) {
  const map = new Map<number, Map<number, string>>();
  const verticalRuns: { x: number; start: number; end: number }[] = [];
  let pos = { x: 0, y: 0 };
  parsed.forEach(({ dir, steps }, commandIdx) => {
    const orientation = directionToOrientation[dir];
    if (orientation === "|") {
      const nextPos = followDirection(pos, dir, steps);
      verticalRuns.push({
        x: pos.x,
        start: Math.min(pos.y, nextPos.y),
        end: Math.max(pos.y, nextPos.y),
      });
      pos = nextPos;
    } else pos = followDirection(pos, dir, steps);
    const nextCommand = parsed[(commandIdx + 1) % parsed.length];
    set(map, pos, turn(dir, nextCommand.dir));
  });
  return { map, verticalRuns };
}
