function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]>;

function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string,
): Record<string, T[]>;

function groupBy<T>(
  array: T[],
  keyOrFn: keyof T | ((item: T) => string),
): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey =
        typeof keyOrFn === "function" ? keyOrFn(item) : String(item[keyOrFn]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}

export { groupBy };
