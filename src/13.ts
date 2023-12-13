// import { testInput as input } from "./13-input";
import { input } from "./13-input";
import { prefillArray, sum } from "./utils/util";

export function doIt(progress: (...params: any[]) => void) {
  const patterns = input.split(`\n\n`).map((pattern) => {
    const rows = pattern.split(`\n`);
    const columns = prefillArray(rows[0].length, (i) =>
      rows.map((row) => row[i]).join(``)
    );
    return { rows, columns };
  });
  const first = patterns
    .map(
      (pattern) => getMatch(pattern.columns) ?? getMatch(pattern.rows)! * 100
    )
    .reduce(sum);
  const second = patterns
    .map((pattern) => {
      const ignoreColumn = getMatch(pattern.columns);
      const ignoreRow = getMatch(pattern.rows);
      const maxIdx = pattern.rows.length * pattern.rows[0].length;
      for (let replace = 0; replace < maxIdx; replace++) {
        const x = replace % pattern.columns.length;
        const y = Math.floor(replace / pattern.columns.length);
        const columns = pattern.columns.map((column, i) =>
          i === x
            ? column.slice(0, y) +
              (column[y] === "." ? "#" : ".") +
              column.slice(y + 1)
            : column
        );
        const rows = pattern.rows.map((row, i) =>
          i === y
            ? row.slice(0, x) + (row[x] === "." ? "#" : ".") + row.slice(x + 1)
            : row
        );

        const cResult = getMatch(columns, ignoreColumn);
        if (cResult) return cResult;
        const rResult = getMatch(rows, ignoreRow);
        if (rResult) return rResult * 100;
      }
      throw "not found";
    })
    .reduce(sum);
  console.log(first, second);
}

function getMatch(lines: string[], ignore: number | undefined = undefined) {
  for (let i = 1; i < lines.length; i++) {
    if (ignore !== i && tryMatch(lines, i)) {
      return i;
    }
  }
  return undefined;
}

function tryMatch(lines: string[], i: number) {
  const linesToMatch = Math.min(i, lines.length - i);
  for (let j = 0; j < linesToMatch; j++) {
    const a = lines[i - j - 1];
    const b = lines[i + j];
    if (a !== b) {
      return false;
    }
  }
  return true;
}
