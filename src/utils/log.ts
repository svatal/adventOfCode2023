export function log<T>(value: T, index: number, array: T[]) {
  if (index === 0) console.log(array);
  return value;
}

export function logEvery<T>(value: T, index: number, array: T[]) {
  console.log(value);
  return value;
}

export function logi<T>(filter: (value: T, index: number) => boolean) {
  return (value: T, index: number, array: T[]) => {
    if (index === 0) console.log("----");

    if (filter(value, index)) console.log(index, value);
    if (index === array.length - 1) console.log("----");
    return value;
  };
}
