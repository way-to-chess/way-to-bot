import { ESortDirection } from "../Models/ESortDirection";

const sortByKey = <T>(
  array: T[],
  key: keyof T,
  sortDirection = ESortDirection.asc,
) => {
  return [...array].sort((a, b) => {
    const aa = a[key];
    const bb = b[key];
    if (typeof aa === "number" && typeof bb === "number") {
      return sortDirection === ESortDirection.asc ? bb - aa : aa - bb;
    }

    if (typeof aa === "string" && typeof bb === "string") {
      return sortDirection === ESortDirection.asc
        ? bb.localeCompare(aa)
        : aa.localeCompare(bb);
    }

    return 0;
  });
};

export { sortByKey };
