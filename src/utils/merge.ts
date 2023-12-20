import { lcm } from "./util";

export interface Target {
  offset: number;
  period: number;
  targets: number[];
}

export const everything: Target = {
  offset: 0,
  period: 1,
  targets: [0],
};

export function mergeTargets(a: Target, b: Target): Target {
  const period = lcm(a.period, b.period);
  const offset = Math.max(a.offset, b.offset);
  const targets: number[] = [];
  for (
    let currentOffset = a.offset;
    currentOffset < period + offset;
    currentOffset += a.period
  ) {
    a.targets.forEach((t) => {
      const target = t + currentOffset;
      const bCandidate = (target - b.offset) % b.period;
      if (b.targets.includes(bCandidate)) {
        targets.push(target - offset);
      }
    });
  }
  return { period, offset, targets };
}
