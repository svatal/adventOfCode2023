// import { testInput as input } from "./05-input";
import { input } from "./05-input";
import { prefillArray } from "./utils/util";

export function doIt(progress: (...params: any[]) => void) {
  const [seedsS, ...sectionsS] = input.split(`\n\n`);
  const [, ...seeds] = seedsS.split(` `).map(Number);
  const transformers = sectionsS.map((s) => {
    const [header, ...ranges] = s.split("\n");
    return ranges.map((r) => {
      const [destStart, sourceStart, length] = r.split(" ").map(Number);
      return { destStart, sourceStart, length };
    });
  });
  const transformed = seeds.map((seed) => {
    transformers.forEach((tr) => {
      let i = 0;
      while (i < tr.length) {
        const range = tr[i];
        if (
          seed >= range.sourceStart &&
          seed < range.sourceStart + range.length
        ) {
          seed = range.destStart + (seed - range.sourceStart);
          return;
        }
        i++;
      }
    });
    return seed;
  });
  const first = Math.min(...transformed);

  let inputRanges = prefillArray(seeds.length / 2, (i) => ({
    start: seeds[i * 2],
    length: seeds[i * 2 + 1],
  }));
  transformers.forEach((tr) => {
    let outputRanges = [];
    let inputRange = inputRanges.pop();
    while (inputRange) {
      let i = 0;
      while (i < tr.length) {
        const range = tr[i];
        if (
          inputRange.start >= range.sourceStart &&
          inputRange.start < range.sourceStart + range.length
        ) {
          const start =
            range.destStart + (inputRange.start - range.sourceStart);
          const maxLength = range.destStart + range.length - start;
          if (inputRange.length <= maxLength) {
            outputRanges.push({ start, length: inputRange.length });
          } else {
            outputRanges.push({ start, length: maxLength });
            inputRanges.push({
              start: inputRange.start + maxLength,
              length: inputRange.length - maxLength,
            });
          }
          break;
        }
        i++;
      }
      if (i === tr.length) {
        outputRanges.push(inputRange);
      }

      inputRange = inputRanges.pop();
    }
    inputRanges = outputRanges;
  });

  const second = Math.min(...inputRanges.map((r) => r.start));
  console.log(first, second);
}
