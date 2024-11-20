const isEmpty = (candidate: unknown[]) => candidate.length === 0;

const isDev = import.meta.env.DEV;

const isHttps = import.meta.env.MODE === "https";

export { isEmpty, isDev, isHttps };
