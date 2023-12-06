// import { testInput as input } from "./06-input";
import { input } from "./06-input";

export function doIt(progress: (...params: any[]) => void) {
  const [times, distances] = input.split(`\n`).map((line) => {
    const [, ...values] = line.replace(/\s+/g, " ").split(" ");
    return values.map(Number);
  });
  const first = times
    .map((raceTime, i) => getWins(raceTime, distances[i]))
    .reduce((a, b) => a * b, 1);

  const [raceTime, maxDistance] = input.split(`\n`).map((line) => {
    const [, value] = line.replace(/\s+/g, "").split(":");
    return +value;
  });
  const second = getWins(raceTime, maxDistance);
  console.log(first, second);
}

function getWins(raceTime: number, maxDistance: number) {
  let wins = 0;
  for (let time = 0; time <= raceTime; time++) {
    const distance = time * (raceTime - time);
    if (distance > maxDistance) {
      wins++;
    }
  }
  return wins;
}
