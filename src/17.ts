// import { testInput as input } from "./17-input";
import { input } from "./17-input";
import {
  Direction,
  IPosition,
  directionToOrientation,
  followDirection,
  orientationToDirection,
  otherOrientation,
  posToString,
  valueInMap,
} from "./utils/position2D";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split("").map((char) => +char));
  const first = find(parsed, 1, 3);
  const second = find(parsed, 4, 10);
  console.log(first, second);
}

function getMoves(
  getCost: (pos: IPosition) => number | undefined,
  pos: IPosition,
  dir: Direction,
  cost: number,
  minMove: number,
  maxMove: number
) {
  let moves = [];
  for (let i = 1; i <= maxMove; i++) {
    pos = followDirection(pos, dir);
    const nextCost = getCost(pos);
    if (nextCost === undefined) return moves;
    cost += nextCost;
    if (i >= minMove)
      moves.push({ pos, cost, orientation: directionToOrientation[dir] });
  }
  return moves;
}

function find(parsed: number[][], minMove: number, maxMove: number) {
  const getCost = valueInMap(parsed);
  const toProcess = [
    ...getMoves(getCost, { x: 0, y: 0 }, ">", 0, minMove, maxMove),
    ...getMoves(getCost, { x: 0, y: 0 }, "v", 0, minMove, maxMove),
  ];
  const visited = new Map<string, number>();
  const target = posToString({ x: parsed[0].length - 1, y: parsed.length - 1 });

  while (toProcess.length > 0) {
    const current = toProcess.shift()!;
    const posS = posToString(current.pos);
    const visitedKey = `${posS}${current.orientation}`;
    const visitedCost = visited.get(visitedKey);
    if (visitedCost !== undefined && visitedCost <= current.cost) continue;
    if (posS === target) return current.cost;
    visited.set(visitedKey, current.cost);

    const nextDirections: Direction[] =
      orientationToDirection[otherOrientation[current.orientation]];
    const next = [
      ...nextDirections
        .map((dir) =>
          getMoves(getCost, current.pos, dir, current.cost, minMove, maxMove)
        )
        .flat(),
    ];
    next.forEach((n) => {
      const idx = toProcess.findIndex(({ cost }) => cost >= n.cost);
      if (idx === -1) toProcess.push(n);
      else toProcess.splice(idx, 0, n);
    });
  }
}
