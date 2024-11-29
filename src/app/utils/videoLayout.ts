
export function calculateVideoLayout(clientsNumber = 1) {
  const pairs = Array.from({ length: clientsNumber })
    .reduce((acc: number[][], _, index: number, arr: unknown[]) => {
      if (index % 2 === 0) {
        acc.push((arr as number[]).slice(index, index + 2));
      }
      return acc;
    }, [] as number[][]);

  const rowsNumber = pairs.length;
  const height = `${100 / rowsNumber}%`;

  return pairs.map((row, index, arr) => {
    if (index === arr.length - 1 && row.length === 1) {
      return [{
        width: '100%',
        height,
      }];
    }

    return row.map(() => ({
      width: '50%',
      height,
    }));
  }).flat();
}