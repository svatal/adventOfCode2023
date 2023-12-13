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
      // console.log("total", matches);
      return matches;
    })
    .reduce((a, b) => a + b, 0);

  const second = parsed
    .map(({ pattern, hashes }) => ({
      pattern: prefillArray(5, () => pattern).join("?"),
      hashes: prefillArray(5, () => hashes).reduce((a, b) => [...a, ...b], []),
    }))
    .map(({ pattern, hashes }) => enrich(pattern, hashes))
    .map(({ pattern, hashes, toHashes, toDots }, i) => {
      const started = Date.now();
      const matches = getMatches2(pattern, hashes, toHashes, toDots);
      console.log(
        Date.now() - started + "ms",
        i,
        pattern,
        hashes.join(","),
        matches
      );
      return matches;
    })
    .reduce((a, b) => a + b, 0);
  console.log(first, second);
  console.log(first);
}

function enrich(pattern: string, hashes: number[]) {
  const expectedHashes = hashes.reduce((a, b) => a + b, 0);
  const hardHashes = [...pattern.matchAll(/#/g)].length;
  const questionMarks = [...pattern.matchAll(/\?/g)].length;
  const toHashes = expectedHashes - hardHashes;
  return { pattern, hashes, toHashes, toDots: questionMarks - toHashes };
}

function getMatches(
  pattern: string,
  hashes: number[],
  toHashes: number,
  toDots: number
): number {
  const firstQM = pattern.indexOf("?");
  if (firstQM === -1) {
    return arrayEquals(getHashes(pattern), hashes) ? 1 : 0;
  }
  return ["#", "."]
    .map((char) => {
      const nextToHashes = char === "#" ? toHashes - 1 : toHashes;
      const nextToDots = char === "." ? toDots - 1 : toDots;
      if (nextToHashes < 0 || nextToDots < 0) return 0;
      const newPattern = pattern.replace("?", char);
      const nextQM = newPattern.indexOf("?");
      if (nextQM === -1)
        return arrayEquals(getHashes(newPattern), hashes) ? 1 : 0;
      const subPattern = newPattern.substring(0, nextQM);
      const subHashes = getHashes(subPattern);
      const lastSubHash = subHashes.pop();
      if (lastSubHash === undefined)
        return getMatches(newPattern, hashes, nextToHashes, nextToDots);
      if (!arrayEquals(hashes.slice(0, subHashes.length), subHashes)) return 0;
      const equalHashToLastSubHash = hashes[subHashes.length];
      if (equalHashToLastSubHash === undefined) return 0;
      if (lastSubHash > equalHashToLastSubHash) return 0;
      if (lastSubHash < equalHashToLastSubHash && !subPattern.endsWith("#"))
        return 0;
      return getMatches(newPattern, hashes, nextToHashes, nextToDots);
    })
    .reduce((a, b) => a + b, 0);
}

function getHashes(pattern: string) {
  const matches = pattern.matchAll(/#+/g);
  return [...matches].map((match) => match[0].length);
}

function getMatches2(
  pattern: string,
  hashes: number[],
  toHashes: number,
  toDots: number
): number {
  if (toHashes < 0 || toDots < 0) return 0;
  // console.log(pattern, hashes.join(","), toHashes, toDots);
  if (hashes.length === 0) {
    // console.log(pattern.includes("#") ? 0 : 1);
    return pattern.includes("#") ? 0 : 1;
  }
  pattern = pattern.replace(/^\.+/, "");
  let sum = 0;
  if (pattern[0] === "?")
    sum += getMatches2(pattern.slice(1), hashes, toHashes, toDots - 1);
  const [runSize, ...nextHashes] = hashes;
  const match = pattern.match("^([#?]{" + runSize + "})");
  if (!match) return sum;
  const after = pattern[runSize];
  if (after === "#") return sum;
  const run = match[0];
  const nextPattern = pattern.substring(runSize + 1);
  sum += getMatches2(
    nextPattern,
    nextHashes,
    toHashes - [...run.matchAll(/\?/g)].length,
    toDots - (after === "?" ? 1 : 0)
  );
  return sum;
}
