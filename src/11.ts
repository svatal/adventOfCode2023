// import { testInput as input } from "./11-input";
import { input } from "./11-input";
import { IPosition } from "./utils/position2D";
import { prefillArray } from "./utils/util";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => line.split(""));
  const emptyColumns = prefillArray(parsed[0].length, (i) => i).filter((i) =>
    parsed.every((line) => line[i] === ".")
  );
  const emptyRows = parsed
    .map((_, i) => i)
    .filter((i) => parsed[i].every((j) => j === "."));
  const galaxies: IPosition[] = [];
  parsed.forEach((line, y) =>
    line.forEach((char, x) => {
      if (char === "#") {
        galaxies.push({ y, x });
      }
    })
  );
  let first = 0;
  let second = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const g1 = galaxies[i];
      const g2 = galaxies[j];
      first +=
        getDist(g1.x, g2.x, emptyColumns, 2) +
        getDist(g1.y, g2.y, emptyRows, 2);
      second +=
        getDist(g1.x, g2.x, emptyColumns, 1000000) +
        getDist(g1.y, g2.y, emptyRows, 1000000);
    }
  }
  console.log(first, second);
}

function getDist(c1: number, c2: number, empty: number[], age: number) {
  const cMin = Math.min(c1, c2);
  const cMax = Math.max(c1, c2);
  const emptyInside = empty.filter((i) => i > cMin && i < cMax).length;
  return cMax - cMin + emptyInside * (age - 1);
}
