const isDev = import.meta.env.DEV;

const isHttps = import.meta.env.MODE === "https";

export {isDev, isHttps};
