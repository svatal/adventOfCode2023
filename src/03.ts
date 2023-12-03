// import { testInput as input } from "./03-input";
import { input } from "./03-input";
import { posToString } from "./utils/position2D";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => line);
  let first = 0;
  let gears = new Map<string, number[]>();
  parsed.forEach((line, lineIdx) => {
    const matches = line.matchAll(/\d(\d)*/g);
    for (const match of matches) {
      const startIdx = match.index!;
      const endIdx = match.index! + match[0].length;
      const number = +match[0];
      let isPartNumber = false;
      examine(lineIdx - 1, startIdx - 1, match[0].length + 2);
      examine(lineIdx + 1, startIdx - 1, match[0].length + 2);
      examine(lineIdx, startIdx - 1, 1);
      examine(lineIdx, endIdx, 1);
      if (isPartNumber) {
        first += number;
      }

      function examine(lineIdx: number, startIdx: number, count: number) {
        const line = parsed[lineIdx];
        if (line === undefined) return;
        for (let i = startIdx; i < startIdx + count; i++) {
          const pos = { x: i, y: lineIdx };
          const symbol = line[i];
          if (symbol === undefined) continue;
          if (isNaN(+symbol) && symbol !== ".") isPartNumber = true;
          if (symbol === "*") {
            const key = posToString(pos);
            const value = gears.get(key) ?? [];
            value.push(number);
            gears.set(key, value);
          }
        }
      }
    }
  });
  const second = [...gears.values()]
    .filter((v) => v.length === 2)
    .map((v) => v[0] * v[1])
    .reduce((a, b) => a + b, 0);
  console.log(first, second);
}
