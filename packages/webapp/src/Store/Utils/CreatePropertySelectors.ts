const createPropertySelectors = <
  S,
  T extends Record<string, any>,
  A extends never | any[],
>(
  selector: (state: S, ...args: A) => T,
): { [P in keyof Required<T>]: (state: S, ...args: A) => T[P] } =>
  new Proxy({} as T, {
    get:
      (_, name) =>
      (state: S, ...args: A) =>
        selector(state, ...args)[name as keyof T],
  });

export { createPropertySelectors };
