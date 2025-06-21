import { TCommonGetManyOptions } from "../api/zod/common/get-many-options.schema";
import { encodeObjectToUrlSafeBase64 } from "./UrlEncoder";

const getUrlWithSearchParams = (url: string, options: TCommonGetManyOptions) =>
  `${url}?q=${encodeObjectToUrlSafeBase64(JSON.stringify(options))}`;

export { getUrlWithSearchParams };
