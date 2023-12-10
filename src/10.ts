// import { testInput as input } from "./10-input";
import { input } from "./10-input";
import {
  IPosition,
  neighbors8,
  posFromString,
  posToString,
  valueInMap,
} from "./utils/position2D";
import { isDefined, prefillArray } from "./utils/util";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => line.split(""));
  const map = parsed.reduce((c, line, y) => {
    line.forEach((char, x) => {
      c.set(posToString({ x, y }), char);
    });
    return c;
  }, new Map<string, string>());
  const start = [...map.entries()].find(([, v]) => v === "S")![0];
  const doubleMap = prefillArray(parsed.length * 2 + 1, () =>
    prefillArray(parsed[0].length * 2 + 1, () => FloodMapType.Empty)
  );
  const startPos = posFromString(start);
  doubleMap[startPos.y * 2 + 1][startPos.x * 2 + 1] = FloodMapType.Wall;
  let route = [
    goTo(map, start, doubleMap, Direction.East),
    goTo(map, start, doubleMap, Direction.West),
    goTo(map, start, doubleMap, Direction.North),
    goTo(map, start, doubleMap, Direction.South),
  ].filter(isDefined);
  let steps = 1;
  while (route[0].pos !== route[1].pos) {
    route = route.map((r) => goTo(map, r.pos, doubleMap, r.dir)!);
    steps++;
  }

  const toFlood = [{ x: 0, y: 0 }];
  doubleMap[0][0] = FloodMapType.Visited;
  while (toFlood.length) {
    const current = toFlood.shift()!;
    const neighbours = neighbors8(current).filter(
      (pos) => valueInMap(doubleMap)(pos) === FloodMapType.Empty
    );
    neighbours.forEach(
      (pos) => (doubleMap[pos.y][pos.x] = FloodMapType.Visited)
    );
    toFlood.push(...neighbours);
  }
  let encircled = 0;
  for (let y = 1; y < doubleMap.length; y += 2) {
    for (let x = 1; x < doubleMap[y].length; x += 2) {
      if (doubleMap[y][x] === FloodMapType.Empty) {
        encircled++;
      }
    }
  }

  const first = steps;
  const second = encircled;
  // console.log(doubleMap.map((line) => line.join("")).join("\n"));
  console.log(first, second);
}

enum FloodMapType {
  Empty,
  Wall,
  Visited,
}

enum Direction {
  North,
  East,
  South,
  West,
}

const nextDirection: Record<Direction, Record<string, Direction>> = {
  [Direction.North]: {
    "|": Direction.North,
    "7": Direction.West,
    F: Direction.East,
  },
  [Direction.East]: {
    "-": Direction.East,
    "7": Direction.South,
    J: Direction.North,
  },
  [Direction.South]: {
    "|": Direction.South,
    L: Direction.East,
    J: Direction.West,
  },
  [Direction.West]: {
    "-": Direction.West,
    L: Direction.North,
    F: Direction.South,
  },
};

const nextPosition: Record<Direction, (pos: IPosition) => IPosition> = {
  [Direction.North]: (pos) => ({ ...pos, y: pos.y - 1 }),
  [Direction.East]: (pos) => ({ ...pos, x: pos.x + 1 }),
  [Direction.South]: (pos) => ({ ...pos, y: pos.y + 1 }),
  [Direction.West]: (pos) => ({ ...pos, x: pos.x - 1 }),
};

function goTo(
  map: Map<string, string>,
  pos: string,
  doubleMap: FloodMapType[][],
  dir: Direction
) {
  const currentPos = posFromString(pos);
  const next = nextPosition[dir](currentPos);
  const nextS = posToString(next);
  const nextChar = map.get(nextS);
  const nextDir =
    nextChar === undefined ? undefined : nextDirection[dir][nextChar];
  if (nextDir === undefined) return undefined;
  let doublePos = { y: currentPos.y * 2 + 1, x: currentPos.x * 2 + 1 };
  for (let i = 0; i < 2; i++) {
    doublePos = nextPosition[dir](doublePos);
    doubleMap[doublePos.y][doublePos.x] = FloodMapType.Wall;
  }
  return { pos: nextS, dir: nextDir };
}
