import { IQueryOptions } from "../interfaces/query.interface";

const textEncoder = new TextEncoder();

const encodeToBase64Binary = (str: string) => {
  const utf8Bytes = textEncoder.encode(str);

  const binary = String.fromCharCode(...utf8Bytes);

  return window.btoa(binary);
};

const getUrlWithSearchParams = (url: string, options: IQueryOptions): string =>
  `${url}?q=${encodeToBase64Binary(JSON.stringify(options))}`;

export { getUrlWithSearchParams };
