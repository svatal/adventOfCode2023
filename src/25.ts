// import { testInput as input } from "./25-input";
import { input } from "./25-input";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input
    .split(`\n`)
    .map((line) => {
      const [src, dest] = line.split(": ");
      return dest.split(" ").map((dest) => [src, dest] as const);
    })
    .flat();
  const map = createMap(parsed);
  for (let i = 0; i < parsed.length; i++) {
    progress(i);
    const [src, dest] = parsed[i];
    const path = findShortestPath(map, src, dest, [parsed[i]]);
    if (!path) throw "unexpected 1";
    const path2 = findShortestPath(map, src, dest, [parsed[i], ...path]);
    if (!path2) throw "unexpected 2";
    const path3 = findShortestPath(map, src, dest, [
      parsed[i],
      ...path,
      ...path2,
    ]);
    if (path3 !== undefined) continue;
    const pCandidates = path.filter(
      (edge) =>
        findShortestPath(map, src, dest, [parsed[i], edge, ...path2]) ===
        undefined
    );
    if (pCandidates.length < 1) continue;
    const p2Candidates = path2.filter(
      (edge) =>
        findShortestPath(map, src, dest, [parsed[i], edge, pCandidates[0]]) ===
        undefined
    );
    if (p2Candidates.length < 1) continue;

    const remove = [parsed[i], pCandidates[0], p2Candidates[0]];
    const filtered = parsed.filter(([src, dest]) =>
      remove.every(
        (r) =>
          (r[0] !== src || r[1] !== dest) && (r[0] !== dest || r[1] !== src)
      )
    );
    const finalMap = createMap(filtered);
    const reached = new Set<string>();
    const toProcess = [filtered[0][0]];
    while (toProcess.length) {
      const current = toProcess.pop()!;
      const toVisit = finalMap.get(current)!.filter((c) => !reached.has(c));
      toVisit.forEach((c) => reached.add(c));
      toProcess.push(...toVisit);
    }

    console.log(reached.size * (finalMap.size - reached.size));
    return;
  }
}

function createMap(parsed: (readonly [string, string])[]) {
  const map = new Map<string, string[]>();
  parsed.forEach(([src, dest]) => {
    const srcConnections = map.get(src) || [];
    srcConnections.push(dest);
    map.set(src, srcConnections);
    const destConnections = map.get(dest) || [];
    destConnections.push(src);
    map.set(dest, destConnections);
  });
  return map;
}

function findShortestPath(
  map: Map<string, string[]>,
  src: string,
  dest: string,
  doNotUse: (readonly [string, string])[]
): (readonly [string, string])[] | undefined {
  const toProcess = [
    { current: src, path: [] as (readonly [string, string])[] },
  ];
  const visited = new Set<string>();
  while (toProcess.length) {
    const { current, path } = toProcess.shift()!;
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    if (current === dest) {
      return path;
    }
    const toVisit = map
      .get(current)!
      .filter(
        (c) =>
          !visited.has(c) &&
          !doNotUse.some(
            ([a, b]) => (a === current && b === c) || (a === c && b === current)
          )
      );
    toProcess.push(
      ...toVisit.map((c) => ({
        current: c,
        path: [...path, [current, c] as const],
      }))
    );
  }
  return undefined;
}
