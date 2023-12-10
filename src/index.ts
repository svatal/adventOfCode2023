import { doIt } from "./10";

const start = Date.now();
let lastReport = start;
doIt((...params) => {
  const t = Date.now();
  if (t - lastReport >= 1000) {
    console.log("...", formatTime(t - start), ...params);
    lastReport = t;
  }
});
console.log("finished in", formatTime(Date.now() - start));

function formatTime(ms: number) {
  return new Date(ms).toISOString().split("T")[1].split(".")[0];
}
