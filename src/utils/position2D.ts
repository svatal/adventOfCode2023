export interface IPosition {
  x: number;
  y: number;
}

export interface ICheckedPosition extends IPosition {
  __type: "ICheckedPosition";
}

export function posToString(p: IPosition): string {
  const { x, y } = p;
  return `${x}|${y}`;
}

export function posFromString(s: string): IPosition {
  const [x, y] = s.split("|").map((v) => +v);
  return { x, y };
}

export function neighbors4(p: IPosition): IPosition[] {
  const { x, y } = p;
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ];
}

export function neighbors8(p: IPosition): IPosition[] {
  const { x, y } = p;
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 },
    { x: x - 1, y: y + 1 },
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y - 1 },
  ];
}
export function existIn<T>(map: T[][]) {
  return (pos: IPosition): pos is ICheckedPosition =>
    map[pos.y]?.[pos.x] !== undefined;
}

export function valueInMap<T>(
  map: T[][]
): <TPos extends IPosition>(
  pos: TPos
) => TPos extends ICheckedPosition ? T : T | undefined {
  return (pos: IPosition) => map[pos.y]?.[pos.x];
}

export type Direction = "v" | ">" | "^" | "<";
export type Orientation = "|" | "-";

export const directionToOrientation: Record<Direction, Orientation> = {
  v: "|",
  ">": "-",
  "^": "|",
  "<": "-",
};

export const otherOrientation: Record<Orientation, Orientation> = {
  "|": "-",
  "-": "|",
};

export const orientationToDirection: Record<Orientation, Direction[]> = {
  "|": ["v", "^"],
  "-": [">", "<"],
};

export function followDirection(
  { x, y }: { x: number; y: number },
  dir: Direction,
  steps = 1
) {
  switch (dir) {
    case ">":
      return { x: x + steps, y };
    case "<":
      return { x: x - steps, y };
    case "^":
      return { x, y: y - steps };
    case "v":
      return { x, y: y + steps };
  }
}
