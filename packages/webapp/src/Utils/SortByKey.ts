import { ESortDirection } from "../Models/ESortDirection.ts";

const sortByKey = <T>(
  array: T[],
  key: keyof T,
  sortDirection = ESortDirection.asc,
) => {
  return [...array].sort((a, b) => {
    const aa = a[key];
    const bb = b[key];
    if (typeof aa === "number" && typeof bb === "number") {
      return sortDirection === ESortDirection.asc ? aa - bb : bb - aa;
    }

    if (typeof aa === "string" && typeof bb === "string") {
      return sortDirection === ESortDirection.asc
        ? aa.localeCompare(bb)
        : bb.localeCompare(aa);
    }

    return 0;
  });
};

export { sortByKey };
