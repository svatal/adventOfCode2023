// import { testInput as input } from "./14-input";
import { input } from "./14-input";
import { IPosition } from "./utils/position2D";

export function doIt(progress: (...params: any[]) => void) {
  const dish = input.split(`\n`).map((line) => line.split(""));
  tilt(dish, Direction.North);
  const first = northSupportBeamLoad(dish);
  tilt(dish, Direction.West);
  tilt(dish, Direction.South);
  tilt(dish, Direction.East);

  const totalCount = 1000000000;
  const cache = new Map<string, number>([
    [dish.map((line) => line.join("")).join("\n"), 1],
  ]);
  for (let i = 2; i <= totalCount; i++) {
    tilt(dish, Direction.North);
    tilt(dish, Direction.West);
    tilt(dish, Direction.South);
    tilt(dish, Direction.East);
    const key = dish.map((line) => line.join("")).join("\n");
    if (cache.has(key)) {
      const cycle = i - cache.get(key)!;
      const remaining = totalCount - i;
      const cycleCount = Math.floor(remaining / cycle);
      // console.log(i, cycle, cycleCount, cycle * cycleCount + i);
      i += cycle * cycleCount;
    } else {
      cache.set(key, i);
    }
  }
  const second = northSupportBeamLoad(dish);
  console.log(first, second);
}

enum Direction {
  North = 1,
  West = 2,
  South = 3,
  East = 4,
}

function move(direction: Direction, current: IPosition): IPosition {
  const { x, y } = current;
  switch (direction) {
    case Direction.North:
      return { x, y: y - 1 };
    case Direction.South:
      return { x, y: y + 1 };
    case Direction.East:
      return { x: x + 1, y };
    case Direction.West:
      return { x: x - 1, y };
  }
}

function tilt(dish: string[][], direction: Direction) {
  for (let y = 0; y < dish.length; y++) {
    const line = dish[y];
    for (let x = 0; x < line.length; x++) {
      const cell = line[x];
      if (cell === "O") {
        let current = { x, y };
        let swapWith: IPosition | undefined = undefined;
        let next = move(direction, current);
        let nextCell = dish[next.y]?.[next.x];
        while (nextCell === "." || nextCell === "O") {
          if (nextCell === ".") swapWith = next;
          next = move(direction, next);
          nextCell = dish[next.y]?.[next.x];
        }
        if (swapWith) {
          dish[swapWith.y][swapWith.x] = "O";
          dish[current.y][current.x] = ".";
        }
      }
    }
  }
}

function northSupportBeamLoad(dish: string[][]) {
  return dish
    .map(
      (line, i) =>
        line.filter((cell) => cell === "O").length * (dish.length - i)
    )
    .reduce((a, b) => a + b, 0);
}
