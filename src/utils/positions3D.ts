export interface IPosition {
  x: number;
  y: number;
  z: number;
}

export function minusPos(p1: IPosition, p2: IPosition) {
  return { x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z };
}

export function plusPos(p1: IPosition, p2: IPosition) {
  return { x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z };
}

export function equalPos(p1: IPosition, p2: IPosition) {
  return p1.x === p2.x && p1.y === p2.y && p1.z === p2.z;
}

export function posToString(p: IPosition) {
  return `${p.x},${p.y},${p.z}`;
}

export function posFromString(s: string): IPosition {
  const [x, y, z] = s.split(",").map((c) => +c);
  return { x, y, z };
}

export function neighbours6({ x, y, z }: IPosition): IPosition[] {
  return [
    { x, y, z: z - 1 },
    { x, y, z: z + 1 },
    { x, y: y - 1, z },
    { x, y: y + 1, z },
    { x: x - 1, y, z },
    { x: x + 1, y, z },
  ];
}

export function valueInMap<T>(map: T[][][]): (p: IPosition) => T | undefined {
  return ({ x, y, z }: IPosition) => map[z]?.[y]?.[x];
}
