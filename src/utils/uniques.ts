/*
const input = [
  { id: 1, vals: [1, 2] },  // unique in third round (after removing 3 and 1)
  { id: 2, vals: [1, 3] },  // unique in second round (after removing 3)
  { id: 3, vals: [3] },     // unique in first round
];
extractUniques(input, "vals")
=>
[
  { id: 1, vals: 2 },
  { id: 2, vals: 1 },
  { id: 3, vals: 3 },
];
*/
export function extractUniques<
  T extends { [k in K]: U[] },
  K extends keyof T,
  U extends T[K] extends (infer U)[] ? U : never
>(input: T[], shouldBeUnique: K): (Omit<T, K> & { [k in K]: U })[] {
  const results: (Omit<T, K> & { [k in K]: U })[] = [];
  while (results.length < input.length) {
    const singles = input.filter((i) => i[shouldBeUnique].length === 1);
    results.push(
      ...singles.map((i) => ({ ...i, [shouldBeUnique]: i[shouldBeUnique][0] }))
    );
    const uniques = new Set<U>(results.map((r) => r[shouldBeUnique]));
    input = input.map((i) => ({
      ...i,
      [shouldBeUnique]: i[shouldBeUnique].filter((u) => !uniques.has(u)),
    }));
  }
  return results;
}
