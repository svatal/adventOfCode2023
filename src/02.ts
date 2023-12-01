// import { testInput as input } from "./02-input";
import { input } from "./02-input";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map(
    (line) => line //
  );
  const first = parsed.length;
  const second = parsed.length;
  console.log(first, second);
}
