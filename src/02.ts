// import { testInput as input } from "./02-input";
import { logEvery } from "./utils/log";
import { input } from "./02-input";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => {
    const [gameS, progS] = line.split(": ");
    const gameId = +gameS.split(" ")[1];
    const draws = progS.split("; ").map((d) =>
      d.split(", ").reduce(
        (a, b) => {
          const [number, color] = b.split(" ");
          return { ...a, [color]: +number };
        },
        { red: 0, green: 0, blue: 0 }
      )
    );
    return { gameId, draws };
  });
  const first = parsed
    .filter((g) =>
      g.draws.every((d) => d.red <= 12 && d.green <= 13 && d.blue <= 14)
    )
    .reduce((a, b) => a + b.gameId, 0);
  const second = parsed
    .map(({ draws }) =>
      draws.reduce((a, b) => ({
        red: Math.max(a.red, b.red),
        green: Math.max(a.green, b.green),
        blue: Math.max(a.blue, b.blue),
      }))
    )
    // .map(logEvery)
    .map(({ red, green, blue }) => red * green * blue)
    .reduce((a, b) => a + b, 0);
  console.log(first, second);
}
