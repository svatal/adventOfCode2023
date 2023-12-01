// import { testInput as input } from "./1-input";
import { input } from "./01-input";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map(
    (line) => line //
  );
  const first = parsed.length;
  const second = parsed.length;
  console.log(first, second);
}
