// import { testInput as input } from "./12-input";
import { input } from "./12-input";
import { arrayEquals, prefillArray } from "./utils/util";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line) => {
    const [pattern, hashesS] = line.split(" ");
    const hashes = hashesS.split(",").map(Number);
    return { pattern, hashes };
  });
  const first = parsed
    .map(({ pattern, hashes }) => enrich(pattern, hashes))
    .map(({ pattern, hashes, toHashes, toDots }) => {
      const matches = getMatches2(pattern, hashes, toHashes, toDots);
      return matches;
    })
    .reduce((a, b) => a + b, 0);

  const second = parsed
    .map(({ pattern, hashes }) => ({
      pattern: prefillArray(5, () => pattern).join("?"),
      hashes: prefillArray(5, () => hashes).reduce((a, b) => [...a, ...b], []),
    }))
    .map(({ pattern, hashes }) => enrich(pattern, hashes))
    .map(({ pattern, hashes, toHashes, toDots }, i) =>
      getMatches2(pattern, hashes, toHashes, toDots)
    )
    .reduce((a, b) => a + b, 0);
  console.log(first, second);
}

function enrich(pattern: string, hashes: number[]) {
  const expectedHashes = hashes.reduce((a, b) => a + b, 0);
  const hardHashes = [...pattern.matchAll(/#/g)].length;
  const questionMarks = [...pattern.matchAll(/\?/g)].length;
  const toHashes = expectedHashes - hardHashes;
  return { pattern, hashes, toHashes, toDots: questionMarks - toHashes };
}

function getMatches2(
  pattern: string,
  hashes: number[],
  toHashes: number,
  toDots: number,
  map: Map<string, number> = new Map()
): number {
  if (toHashes < 0 || toDots < 0) return 0;
  if (hashes.length === 0) {
    return pattern.includes("#") ? 0 : 1;
  }
  const key = pattern + "/" + hashes.join(",");
  const cached = map.get(key);
  if (cached !== undefined) return cached;
  pattern = pattern.replace(/^\.+/, "");
  let sum = 0;
  if (pattern[0] === "?")
    sum += getMatches2(pattern.slice(1), hashes, toHashes, toDots - 1, map);
  const [runSize, ...nextHashes] = hashes;
  const match = pattern.match("^([#?]{" + runSize + "})");
  if (!match) {
    map.set(key, sum);
    return sum;
  }
  const after = pattern[runSize];
  if (after === "#") {
    map.set(key, sum);
    return sum;
  }
  const run = match[0];
  const nextPattern = pattern.substring(runSize + 1);
  sum += getMatches2(
    nextPattern,
    nextHashes,
    toHashes - [...run.matchAll(/\?/g)].length,
    toDots - (after === "?" ? 1 : 0),
    map
  );
  map.set(key, sum);
  return sum;
}
