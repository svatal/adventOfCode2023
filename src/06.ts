// import { testInput as input } from "./06-input";
import { input } from "./06-input";
import { prefillArray } from "./utils/util";

export function doIt(progress: (...params: any[]) => void) {
  const [times, distances] = input.split(`\n`).map((line) => {
    const [, ...values] = line.replace(/\s+/g, " ").split(" ");
    return values.map(Number);
  });
  const first = times
    .map((raceTime, i) => {
      const maxDistance = distances[i];
      return prefillArray(raceTime, (time) => time * (raceTime - time)).filter(
        (d) => d > maxDistance
      ).length;
    })
    .reduce((a, b) => a * b, 1);

  const [raceTime, maxDistance] = input.split(`\n`).map((line) => {
    const [, value] = line.replace(/\s+/g, "").split(":");
    return +value;
  });
  const second = prefillArray(
    raceTime,
    (time) => time * (raceTime - time)
  ).filter((d) => d > maxDistance).length;
  console.log(first, second);
}
