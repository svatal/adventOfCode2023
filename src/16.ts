// import { testInput as input } from "./16-input";
import { input } from "./16-input";
import { posToString } from "./utils/position2D";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => line.split(``));
  console.log(parsed.map((line) => line.join(``)).join(`\n`));

  const first = energize(parsed, { x: 0, y: 0, inputDir: ">" });
  const candidates = [
    ...parsed[0].map((_, i) => ({ x: i, y: 0, inputDir: "v" })),
    ...parsed[0].map((_, i) => ({ x: i, y: parsed.length - 1, inputDir: "^" })),
    ...parsed.map((_, i) => ({ x: 0, y: i, inputDir: ">" })),
    ...parsed.map((_, i) => ({ x: parsed[0].length - 1, y: i, inputDir: "<" })),
  ];
  const second = Math.max(...candidates.map((c) => energize(parsed, c)));
  console.log(first, second);
}

function energize(
  parsed: string[][],
  start: { x: number; y: number; inputDir: string }
) {
  const unprocessed = [start];
  const visited = new Set<string>();
  const processed = new Set<string>();
  while (unprocessed.length > 0) {
    const current = unprocessed.pop()!;
    const currentS = posToString(current);
    const currentKey = currentS + current.inputDir;
    if (processed.has(currentKey)) continue;
    processed.add(currentKey);
    const char = parsed[current.y]?.[current.x];
    if (!char) continue;
    visited.add(currentS);

    const dirs = nextDirections[current.inputDir][char];
    dirs.forEach((dir) =>
      unprocessed.push({ ...followDirection(current, dir), inputDir: dir })
    );
  }
  return visited.size;
}

function followDirection({ x, y }: { x: number; y: number }, dir: string) {
  switch (dir) {
    case ">":
      return { x: x + 1, y };
    case "<":
      return { x: x - 1, y };
    case "^":
      return { x, y: y - 1 };
    case "v":
      return { x, y: y + 1 };
    default:
      throw "unknown direction";
  }
}

const nextDirections: Record<string, Record<string, string[]>> = {
  ">": {
    ".": [">"],
    "/": ["^"],
    "\\": ["v"],
    "-": [">"],
    "|": ["^", "v"],
  },
  "<": {
    ".": ["<"],
    "/": ["v"],
    "\\": ["^"],
    "-": ["<"],
    "|": ["^", "v"],
  },
  "^": {
    ".": ["^"],
    "/": [">"],
    "\\": ["<"],
    "-": ["<", ">"],
    "|": ["^"],
  },
  v: {
    ".": ["v"],
    "/": ["<"],
    "\\": [">"],
    "-": ["<", ">"],
    "|": ["v"],
  },
};
