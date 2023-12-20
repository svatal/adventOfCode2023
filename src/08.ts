// import { testInput as input } from "./08-input";
import { input } from "./08-input";
import { everything, mergeTargets } from "./utils/merge";

export function doIt(progress: (...params: any[]) => void) {
  const [instructionsS, nodesS] = input.split(`\n\n`);
  const instructions = instructionsS.split(``);
  const nodes = nodesS
    .split(`\n`)
    .map((line) => {
      const [, name, left, right] = line.match(/(.+) = \((.+), (.+)\)/)!;
      return { name, left, right };
    })
    .reduce((c, i) => {
      c.set(i.name, i);
      return c;
    }, new Map<string, Node>());
  let current = nodes.get(`AAA`)!;
  let steps = 0;
  while (current.name !== `ZZZ`) {
    if (instructions[steps % instructions.length] === `L`) {
      current = nodes.get(current.left)!;
    } else {
      current = nodes.get(current.right)!;
    }
    steps++;
  }
  const first = steps;

  let toMatch = [...nodes.values()].filter((n) => n.name.endsWith("A"));
  let result = everything;
  while (toMatch.length) {
    const targets = getTargets(toMatch.pop()!, nodes, instructions);
    result = mergeTargets(result, targets);
    console.log(targets, result);
  }
  const second = result.targets[0] + result.offset;

  console.log(first, second);
}

interface Node {
  name: string;
  left: string;
  right: string;
}

function getTargets(
  node: Node,
  nodes: Map<string, Node>,
  instructions: string[]
) {
  let steps = 0;
  let targets: number[] = [];
  let periodStarts: string[] = [];
  while (true) {
    if (steps % instructions.length === 0) {
      const before = periodStarts.indexOf(node.name);
      if (before !== -1) {
        // console.log("found", node.name, periodStarts, targets);
        const offset = before * instructions.length;
        return {
          offset,
          period: (periodStarts.length - before) * instructions.length,
          targets: targets.map((t) => t - offset).filter((t) => t >= 0),
        };
      }
      periodStarts.push(node.name);
    }
    if (instructions[steps % instructions.length] === `L`) {
      node = nodes.get(node.left)!;
    } else {
      node = nodes.get(node.right)!;
    }
    steps++;
    if (node.name.endsWith("Z")) {
      targets.push(steps);
    }
  }
}
