export function sum(a: number, b: number): number {
  return a + b;
}

export function gcd(a: number, b: number): number {
  return !b ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

export function splitToGroupsOf<T>(a: T[], n: number): T[][] {
  a = [...a];
  const groups: T[][] = [];
  while (a.length) {
    groups.push(a.splice(0, n));
  }
  return groups;
}

export function prefillArray<T>(
  length: number,
  getItem: (idx: number) => T
): T[] {
  return Array.from({ length }, (_, idx) => getItem(idx));
}

export function toDictionary<T, U>(
  arr: T[],
  getKey: (item: T) => string,
  getValue: (item: T) => U
): Record<string, U> {
  return arr.reduce((c, i) => {
    c[getKey(i)] = getValue(i);
    return c;
  }, {} as Record<string, U>);
}

export function isDefined<T>(t: T | undefined): t is T {
  return t !== undefined;
}
