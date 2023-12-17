// import { testInput as input } from "./17-input";
import { input } from "./17-input";
import { IPosition, posToString, valueInMap } from "./utils/position2D";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split("").map((char) => +char));
  const first = find(parsed);
  const second = find2(parsed);
  console.log(first, second);
}

function find(parsed: number[][]) {
  const toProcess = [
    {
      pos: { x: 0, y: 1 },
      heading: "v" as Direction,
      movesRemaining: 2,
      cost: valueInMap(parsed)({ x: 0, y: 1 })!,
    },
    {
      pos: { x: 1, y: 0 },
      heading: ">" as Direction,
      movesRemaining: 2,
      cost: valueInMap(parsed)({ x: 1, y: 0 })!,
    },
  ];
  const visited = new Map<string, number>();
  const target = posToString({ x: parsed[0].length - 1, y: parsed.length - 1 });

  while (toProcess.length > 0) {
    const current = toProcess.shift()!;
    const posS = posToString(current.pos);
    const visitedKey = `${posS}${current.heading}${current.movesRemaining}`;
    const visitedCost = visited.get(visitedKey);
    if (visitedCost !== undefined && visitedCost <= current.cost) continue;
    if (posS === target) return current.cost;
    visited.set(visitedKey, current.cost);

    const next = [
      ...turns[current.heading].map((dir) => ({
        pos: followDirection(current.pos, dir),
        heading: dir,
        movesRemaining: 2,
      })),
      {
        pos: followDirection(current.pos, current.heading),
        heading: current.heading,
        movesRemaining: current.movesRemaining - 1,
      },
    ]
      .filter(({ movesRemaining }) => movesRemaining >= 0)
      .map((n) => ({ n, nextCost: valueInMap(parsed)(n.pos) }))
      .filter(({ nextCost }) => nextCost !== undefined)
      .map(({ n, nextCost }) => ({ ...n, cost: current.cost + nextCost! }));
    next.forEach((n) => {
      const idx = toProcess.findIndex(({ cost }) => cost >= n.cost);
      if (idx === -1) toProcess.push(n);
      else toProcess.splice(idx, 0, n);
    });
  }
}

function getMoves(
  getCost: (pos: IPosition) => number | undefined,
  pos: IPosition,
  dir: Direction,
  cost: number
) {
  let moves = [];
  for (let i = 1; i <= 10; i++) {
    pos = followDirection(pos, dir);
    const nextCost = getCost(pos);
    if (nextCost === undefined) return moves;
    cost += nextCost;
    if (i >= 4)
      moves.push({
        pos: pos,
        cost,
        heading: dir === ">" || dir === "<" ? ("-" as const) : ("|" as const),
      });
  }
  return moves;
}

function find2(parsed: number[][]) {
  const getCost = valueInMap(parsed);
  const toProcess = [
    ...getMoves(getCost, { x: 0, y: 0 }, ">", 0),
    ...getMoves(getCost, { x: 0, y: 0 }, "v", 0),
  ];
  const visited = new Map<string, number>();
  const target = posToString({ x: parsed[0].length - 1, y: parsed.length - 1 });

  while (toProcess.length > 0) {
    const current = toProcess.shift()!;
    const posS = posToString(current.pos);
    const visitedKey = `${posS}${current.heading}`;
    const visitedCost = visited.get(visitedKey);
    if (visitedCost !== undefined && visitedCost <= current.cost) continue;
    if (posS === target) return current.cost;
    visited.set(visitedKey, current.cost);

    const nextDirections: Direction[] =
      current.heading === "-" ? ["v", "^"] : [">", "<"];
    const next = [
      ...nextDirections
        .map((dir) => getMoves(getCost, current.pos, dir, current.cost))
        .flat(),
    ];
    next.forEach((n) => {
      const idx = toProcess.findIndex(({ cost }) => cost >= n.cost);
      if (idx === -1) toProcess.push(n);
      else toProcess.splice(idx, 0, n);
    });
  }
}

type Direction = "v" | ">" | "^" | "<";

const turns: Record<Direction, Direction[]> = {
  v: [">", "<"],
  ">": ["^", "v"],
  "^": ["<", ">"],
  "<": ["v", "^"],
};

function followDirection({ x, y }: { x: number; y: number }, dir: Direction) {
  switch (dir) {
    case ">":
      return { x: x + 1, y };
    case "<":
      return { x: x - 1, y };
    case "^":
      return { x, y: y - 1 };
    case "v":
      return { x, y: y + 1 };
  }
}
