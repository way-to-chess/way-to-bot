const isEmpty = (candidate: unknown[]) => candidate.length === 0;

const isDev = import.meta.env.DEV;

export { isEmpty, isDev };
