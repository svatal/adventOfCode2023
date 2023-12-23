// import { testInput as input } from "./23-input";
import { input } from "./23-input";
import {
  IPosition,
  existIn,
  followDirection,
  neighbors4,
  posFromString,
  posToString,
  valueInMap,
} from "./utils/position2D";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => line.split(""));
  let startPos = { y: 0, x: parsed[0].findIndex((v) => v === ".") };

  const first = deepFirst2(startPos);
  const second = deepFirst3(startPos);
  console.log(first, second);

  function deepFirst2(pos: IPosition): number {
    const targetY = parsed.length - 1;
    const toProcess = [{ pos, visited: new Set<string>() }];
    let maxPathLength = 0;
    while (toProcess.length) {
      const { pos, visited } = toProcess.pop()!;
      if (targetY === pos.y) {
        maxPathLength = Math.max(maxPathLength, visited.size);
        continue;
      }
      const newVisited = new Set([...visited, posToString(pos)]);
      directions
        .map((dir) => ({ dir, pos: followDirection(pos, dir) }))
        .map((v) => ({ ...v, char: valueInMap(parsed)(v.pos) }))
        .filter(
          ({ char, pos, dir }) =>
            !visited.has(posToString(pos)) && (char === "." || char === dir)
        )
        .forEach(({ pos }) => {
          toProcess.push({ pos, visited: newVisited });
        });
    }
    return maxPathLength;
  }

  function deepFirst3(pos: IPosition): number {
    const targetY = parsed.length - 1;
    const toProcess = [{ pos, visited: new Set<string>(), pathLength: 0 }];
    let maxPathLength = 0;
    const desc = describe();
    while (toProcess.length) {
      const { pos, visited, pathLength } = toProcess.pop()!;
      progress(maxPathLength, toProcess.length);
      if (targetY === pos.y) {
        maxPathLength = Math.max(maxPathLength, pathLength);
        continue;
      }
      const posS = posToString(pos);
      const newVisited = new Set([...visited, posS]);
      desc
        .get(posS)!
        .filter((n) => !visited.has(n.to))
        .forEach((n) => {
          toProcess.push({
            pos: posFromString(n.to),
            visited: newVisited,
            pathLength: pathLength + n.tiles,
          });
        });
    }
    return maxPathLength;
  }

  function describe() {
    const toProcess = [startPos];
    const processed = new Set<string>();
    const map = new Map<string, { to: string; tiles: number }[]>();
    while (toProcess.length) {
      const pos = toProcess.pop()!;
      const key = posToString(pos);
      if (processed.has(key)) continue;
      processed.add(key);
      const neighbors = directions
        .map((dir) => followDirection(pos, dir))
        .filter((n) => existIn(parsed)(n) && valueInMap(parsed)(n) !== "#")
        .map((n) => followPath(n, pos));
      map.set(key, neighbors);
      toProcess.push(
        ...neighbors
          .filter((n) => !processed.has(n.to))
          .map(({ to }) => posFromString(to))
      );
    }
    return map;
  }

  function followPath(pos: IPosition, prevPos: IPosition, tiles = 1) {
    const next = neighbors4(pos).filter(
      (n) =>
        posToString(n) !== posToString(prevPos) &&
        existIn(parsed)(n) &&
        valueInMap(parsed)(n) !== "#"
    );
    if (next.length === 1) return followPath(next[0], pos, tiles + 1);
    return { to: posToString(pos), tiles };
  }
}

const directions = [">", "<", "v", "^"] as const;
