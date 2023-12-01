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
export function existIn(map: number[][]) {
  return (pos: IPosition): pos is ICheckedPosition =>
    map[pos.y] !== undefined && map[pos.y][pos.x] !== undefined;
}

export function valueInMap<T>(
  map: T[][]
): <TPos extends IPosition>(
  pos: TPos
) => TPos extends ICheckedPosition ? T : T | undefined {
  return (pos: IPosition) => map[pos.y]?.[pos.x];
}
