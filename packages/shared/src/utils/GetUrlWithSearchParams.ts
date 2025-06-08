import { TCommonGetManyOptions } from "../api/zod/common/get-many-options.schema";

const textEncoder = new TextEncoder();

const encodeToBase64Binary = (str: string) => {
  const utf8Bytes = textEncoder.encode(str);

  const binary = String.fromCharCode(...utf8Bytes);

  return window.btoa(binary);
};

const getUrlWithSearchParams = (url: string, options: TCommonGetManyOptions) =>
  `${url}?q=${encodeToBase64Binary(JSON.stringify(options))}`;

export { getUrlWithSearchParams };
