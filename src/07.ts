// import { testInput as input } from "./07-input";
import { input } from "./07-input";
import { sum } from "./utils/util";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => {
    const [hand, bet] = line.split(" ");
    const counts = hand.split("").reduce((counts, card) => {
      counts.set(card, (counts.get(card) ?? 0) + 1);
      return counts;
    }, new Map<string, number>());
    return { hand, bet: +bet, counts };
  });
  const first = parsed
    .map(({ hand, bet, counts }) => {
      const [first, second] = [...counts.values()].sort().reverse();
      const rank = first * 10 + (second ?? 0);
      return { hand, bet, rank };
    })
    .sort((a, b) =>
      compare(
        [a.rank, ...a.hand.split("").map(cardValue)],
        [b.rank, ...b.hand.split("").map(cardValue)]
      )
    )
    .map((x, i) => x.bet * (i + 1))
    .reduce(sum);
  const second = parsed
    .map(({ hand, bet, counts }) => {
      const jokers = counts.get("J") ?? 0;
      counts.delete("J");
      const [first, second] = [...counts.values()].sort().reverse();
      const rank = ((first ?? 0) + jokers) * 10 + (second ?? 0);
      return { hand, bet, rank };
    })
    .sort((a, b) =>
      compare(
        [a.rank, ...a.hand.split("").map(cardValue2)],
        [b.rank, ...b.hand.split("").map(cardValue2)]
      )
    )
    .map((x, i) => x.bet * (i + 1))
    .reduce(sum);
  console.log(first, second);
}

function cardValue(card: string) {
  switch (card) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return 11;
    case "T":
      return 10;
    default:
      return parseInt(card, 10);
  }
}

function cardValue2(card: string) {
  if (card === "J") return 1;
  return cardValue(card);
}

function compare(a: number[], b: number[]) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  throw new Error(`same! ${a}, ${b}`);
}
