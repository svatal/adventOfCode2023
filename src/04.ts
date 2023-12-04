// import { testInput as input } from "./04-input";
import { input } from "./04-input";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => {
    const [, numbersS] = line.replace(/  /g, " ").split(": ");
    const [winningNumbers, myNumbers] = numbersS
      .split(" | ")
      .map((s) => s.split(" ").map((n) => +n));
    const matches = winningNumbers.filter((n) =>
      myNumbers.some((mn) => mn === n)
    ).length;
    return matches;
  });
  const first = parsed
    .map((matches) => (matches === 0 ? 0 : Math.pow(2, matches - 1)))
    .reduce((a, b) => a + b, 0);

  const counts = new Map<number, number>();
  let second = 0;
  parsed.forEach((matches, i) => {
    const count = counts.get(i) ?? 1;
    second += count;
    for (let j = 1; j <= matches; j++) {
      const actual = counts.get(i + j) ?? 1;
      counts.set(i + j, actual + count);
    }
  });
  console.log(first, second);
}
