// import { testInput as input } from "./template-input";
import { input } from "./template-input";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map(
    (line) => line //
  );
  const first = parsed.length;
  const second = parsed.length;
  console.log(first, second);
}
