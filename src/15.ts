// import { testInput as input } from "./15-input";
import { input } from "./15-input";
import { prefillArray } from "./utils/util";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`,`);
  const first = parsed.map((line) => getHash(line)).reduce((a, b) => a + b, 0);
  const second = parsed
    .map((line) => {
      if (line.includes("-")) {
        return { op: "-", label: line.split("-")[0] } as const;
      } else {
        const [label, value] = line.split("=");
        return { op: "=", label, value: +value } as const;
      }
    })
    .reduce(
      (a, b) => {
        const hash = getHash(b.label);
        if (b.op === "-") {
          a[hash] = a[hash].filter((v) => v.label !== b.label);
        } else {
          const lens = a[hash].find((v) => v.label === b.label);
          if (lens) {
            lens.value = b.value;
          } else {
            a[hash].push({ label: b.label, value: b.value });
          }
        }
        return a;
      },
      prefillArray(256, () => [] as { label: string; value: number }[])
    )
    .reduce(
      (a1, box, boxIdx) =>
        a1 +
        box.reduce(
          (a2, lens, lensIdx) => a2 + lens.value * (lensIdx + 1) * (boxIdx + 1),
          0
        ),
      0
    );
  console.log(first, second);
}

function getHash(s: string) {
  return s
    .split("")
    .map((ch) => ch.charCodeAt(0))
    .reduce((a, b) => ((a + b) * 17) % 256, 0);
}
