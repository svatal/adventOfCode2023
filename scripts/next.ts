import * as fs from "fs";
import * as cp from "child_process";

const index = fs.readFileSync("./src/index.ts", "utf-8");
const firstLine = index.split("\n")[0];
const start = firstLine.indexOf("./") + 2;
const actual = firstLine.substring(start, start + 2);
const next = (+actual + 1).toString();

console.log(`copying ${next}-input.ts`);
fs.copyFileSync("./src/template-input.ts", `./src/${next}-input.ts`);

console.log(`writing ${next}.ts`);
const template = fs.readFileSync("./src/template.ts", "utf-8");
const template2 = template.replace(
  new RegExp("template-input", "g"),
  `${next}-input`
);
fs.writeFileSync(`./src/${next}.ts`, template2);

console.log("updating index.ts");
const index2 = index.replace(actual, next);
fs.writeFileSync(`./src/index.ts`, index2);

console.log("opening the new files");
cp.execSync(`code ./src/${next}-input.ts ./src/${next}.ts`);

console.log("done!");
