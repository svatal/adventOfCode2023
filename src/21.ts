// import { testInput as input } from "./21-input";
import { input } from "./21-input";
import {
  Direction,
  IPosition,
  followDirection,
  neighbors4,
  posFromString,
  posToString,
  valueInMap,
} from "./utils/position2D";

export function doIt(progress: (...params: any[]) => void) {
  let start: IPosition = { x: 0, y: 0 };
  const parsed = input.split(`\n`).map((line, y) => {
    const sIdx = line.indexOf("S");
    if (sIdx !== -1) {
      start = { x: sIdx, y };
    }
    return line.replace("S", ".").split("");
  });
  let toProcess: IPosition[] = [start];
  let described = new Map<string, ReturnType<typeof describe>>();
  while (toProcess.length > 0) {
    const next = toProcess.shift()!;
    const nextS = posToString(next);
    if (described.has(nextS)) continue;
    const result = describe(next);
    described.set(nextS, result);
    Object.values(result.expand).forEach((e) => {
      if (e) {
        toProcess.push(e.startingPos);
      }
    });
  }
  const first = spread(64, false);
  const second = spread3(26501365);
  console.log(first, second);

  function spread(steps: number, infiniteMaze: boolean) {
    const getTile = valueInMap(parsed);
    let previousEdge = new Set<string>();
    let previousCount = 0;
    let currentEdge = new Set<string>([posToString(start)]);
    let currentCount = 1;
    for (let i = 0; i < steps; i++) {
      const nextEdge = new Set<string>();
      currentEdge.forEach((pos) => {
        const cPos = posFromString(pos);
        const neighbors = neighbors4(cPos);
        neighbors.forEach((n) => {
          const tile = infiniteMaze
            ? getTile({
                x: fixInfiniteCoord(n.x, parsed[0].length),
                y: fixInfiniteCoord(n.y, parsed.length),
              })
            : getTile(n);
          if (tile === ".") {
            const nS = posToString(n);
            if (!previousEdge.has(nS)) nextEdge.add(nS);
          }
        });
      });
      previousEdge = currentEdge;
      currentEdge = nextEdge;
      const realPrevCount = previousCount;
      previousCount = currentCount;
      currentCount = realPrevCount + currentEdge.size;
      progress(i, currentCount);
    }
    return currentCount;
  }

  function describe(start: IPosition) {
    const getTile = valueInMap(parsed);
    let previousEdge = new Set<string>();
    let previousCount = 0;
    let currentEdge = new Set<string>([posToString(start)]);
    let currentCount = 1;
    let step = 0;
    const counts: number[] = [];
    let expand: Record<
      Direction,
      { inStep: number; startingPos: IPosition } | undefined
    > = { v: undefined, ">": undefined, "^": undefined, "<": undefined };

    while (currentEdge.size > 0) {
      step++;
      counts.push(currentCount);
      const nextEdge = new Set<string>();
      currentEdge.forEach((pos) => {
        const cPos = posFromString(pos);
        const neighbors = neighbors4(cPos);
        neighbors.forEach((n) => {
          if (n.x < 0 && expand["<"] === undefined) {
            expand["<"] = {
              inStep: step,
              startingPos: { x: n.x + parsed[0].length, y: n.y },
            };
          } else if (n.x >= parsed[0].length && expand[">"] === undefined) {
            expand[">"] = {
              inStep: step,
              startingPos: { x: n.x - parsed[0].length, y: n.y },
            };
          } else if (n.y < 0 && expand["^"] === undefined) {
            expand["^"] = {
              inStep: step,
              startingPos: { x: n.x, y: n.y + parsed.length },
            };
          } else if (n.y >= parsed.length && expand["v"] === undefined) {
            expand["v"] = {
              inStep: step,
              startingPos: { x: n.x, y: n.y - parsed.length },
            };
          }
          const tile = getTile(n);
          if (tile === ".") {
            const nS = posToString(n);
            if (!previousEdge.has(nS)) nextEdge.add(nS);
          }
        });
      });
      previousEdge = currentEdge;
      currentEdge = nextEdge;
      const realPrevCount = previousCount;
      previousCount = currentCount;
      currentCount = realPrevCount + currentEdge.size;

      progress(step, currentCount);
    }
    return { step, expand, counts };
  }

  // not optimal enough :)
  function spread2(steps: number) {
    const visitedMazes = new Set<string>();
    const mazesToProcess = [
      { mazePos: { x: 0, y: 0 }, start, remainingSteps: steps },
    ];
    let counts = 0;
    while (mazesToProcess.length > 0) {
      const { mazePos, start, remainingSteps } = mazesToProcess.shift()!;
      progress(
        remainingSteps,
        counts,
        visitedMazes.size,
        mazesToProcess.length
      );
      const mazePosS = posToString(mazePos);
      if (visitedMazes.has(mazePosS)) continue;
      visitedMazes.add(mazePosS);
      console.log(steps - remainingSteps, start);
      const description = described.get(posToString(start))!;
      if (description.counts.length > remainingSteps)
        counts += description.counts[remainingSteps];
      else {
        counts +=
          description.counts[
            description.counts.length -
              ((remainingSteps - description.counts.length) % 2 === 1 ? 1 : 2)
          ];
      }
      Object.entries(description.expand).forEach(([dir, e]) => {
        const ePos = followDirection(mazePos, dir as Direction);
        if (
          e &&
          e.inStep <= remainingSteps &&
          !visitedMazes.has(posToString(ePos))
        ) {
          const eSteps = remainingSteps - e.inStep;
          const idx = mazesToProcess.findIndex(
            (m) => m.remainingSteps < eSteps
          );
          const toInsert = {
            mazePos: ePos,
            start: e.startingPos,
            remainingSteps: eSteps,
          };
          if (idx === -1) mazesToProcess.push(toInsert);
          else mazesToProcess.splice(idx, 0, toInsert);
        }
      });
    }
    return counts;
  }

  function spread3(steps: number) {
    let count = 0;
    const centerDesc = described.get(posToString(start))!;
    count += getCount(centerDesc, steps);
    count += expand(centerDesc, steps, "v");
    count += expand(centerDesc, steps, "^");
    count += expand(centerDesc, steps, "<");
    count += expand(centerDesc, steps, ">");
    let leftRefFromCenter = centerDesc.expand["<"]!;
    let leftRemainingSteps = steps - leftRefFromCenter!.inStep;
    const leftDesc = described.get(
      posToString(leftRefFromCenter!.startingPos)
    )!;
    count += expandDiagonal(leftDesc, leftRemainingSteps, "^");
    count += expandDiagonal(leftDesc, leftRemainingSteps, "v");
    let rightRefFromCenter = centerDesc.expand[">"]!;
    let rightRemainingSteps = steps - rightRefFromCenter!.inStep;
    const rightDesc = described.get(
      posToString(rightRefFromCenter!.startingPos)
    )!;
    count += expandDiagonal(rightDesc, rightRemainingSteps, "^");
    count += expandDiagonal(rightDesc, rightRemainingSteps, "v");
    return count;
  }

  function expand(
    centerDesc: ReturnType<typeof describe>,
    steps: number,
    dir: Direction
  ) {
    let count = 0;
    const refFromCenter = centerDesc.expand[dir]!;
    const dirDesc = described.get(posToString(refFromCenter.startingPos))!;
    let remainingSteps = steps - refFromCenter.inStep;
    while (remainingSteps > 0) {
      count += getCount(dirDesc, remainingSteps);
      remainingSteps -= dirDesc.expand[dir]!.inStep;
    }
    return count;
  }

  function expandDiagonal(
    startingDesc: ReturnType<typeof describe>,
    steps: number,
    dir: Direction
  ) {
    let count = 0;
    const refFromStarting = startingDesc.expand[dir]!;
    const diagonalDesc = described.get(
      posToString(refFromStarting.startingPos)
    )!;
    let remainingSteps = steps - refFromStarting.inStep;
    let mazeCount = 1;
    while (remainingSteps > 0) {
      count += getCount(diagonalDesc, remainingSteps) * mazeCount;
      remainingSteps -= diagonalDesc.expand[dir]!.inStep;
      mazeCount++;
    }
    return count;
  }

  function getCount(description: ReturnType<typeof describe>, steps: number) {
    if (description.counts.length > steps) return description.counts[steps];
    else {
      return description.counts[
        description.counts.length -
          ((steps - description.counts.length) % 2 === 1 ? 1 : 2)
      ];
    }
  }
}

function fixInfiniteCoord(x: number, max: number) {
  while (x < 0) {
    x += 1000 * max;
  }
  return x % max;
}
