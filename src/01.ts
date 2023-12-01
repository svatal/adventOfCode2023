// import { testInput as input } from "./01-input";
import { input } from "./01-input";

const numbers = /(one|two|three|four|five|six|seven|eight|nine|[0-9])/;

var numberDict: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function toNumber(num: string): string {
  return numberDict[num] ?? num;
}

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`);
  const first = parsed
    .map((i) => i.match("\\d")![0] + i.match("(\\d)[^\\d]*$")![1])
    .reduce((a, b) => +a + +b, 0);

  const second = parsed
    .map((i) => {
      const matches = matchAll(i);
      const res = toNumber(matches[0]) + toNumber(matches[matches.length - 1]);
      // console.log(i, res, matches);
      return res;
    })
    .reduce((a, b) => +a + +b, 0);
  console.log(first, second);
}

function matchAll(i: string) {
  const matches = [];
  let match: RegExpMatchArray | null;
  while ((match = i.match(numbers)) !== null) {
    matches.push(match[0]);
    i = i.slice(match.index! + 1); // regular i.matchAll(numbers) would have skipped matches that are part of other matches - like 'oneight'
  }
  return matches;
}
