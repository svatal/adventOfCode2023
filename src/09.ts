// import { testInput as input } from "./09-input";
import { sum } from "./utils/util";
import { input } from "./09-input";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split(` `).map((n) => +n));
  const first = parsed.map((line) => countLast(line)).reduce(sum);
  const second = parsed.map((line) => countPrecedor(line)).reduce(sum);
  console.log(first, second);
}

function countLast(numbers: number[]): number {
  // console.log(numbers);
  if (numbers.length < 2) return numbers[0] ?? 0;
  if (numbers.every((n) => n === 0)) return 0;
  const diffs = numbers.slice(1).map((n, idx) => n - numbers[idx]);
  const last = numbers[numbers.length - 1] + countLast(diffs);
  // console.log(last);
  return last;
}

function countPrecedor(numbers: number[]): number {
  // console.log(numbers);
  if (numbers.length < 2) return numbers[0] ?? 0;
  if (numbers.every((n) => n === 0)) return 0;
  const diffs = numbers.slice(1).map((n, idx) => n - numbers[idx]);
  const last = numbers[0] - countPrecedor(diffs);
  // console.log(last);
  return last;
}
