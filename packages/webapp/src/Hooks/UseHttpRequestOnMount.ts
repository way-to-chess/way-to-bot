import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { httpApi, type THttpApi } from "../HttpApi/HttpApi.ts";

type THttpRequestKey = keyof THttpApi;

interface IHookResponse<T> {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
}

function useHttpRequestOnMount<
  K extends THttpRequestKey,
  A extends Parameters<THttpApi[K]>,
>(httpKey: K, args: A): IHookResponse<Awaited<ReturnType<THttpApi[K]> | null>>;

function useHttpRequestOnMount<
  K extends THttpRequestKey,
  A extends Parameters<THttpApi[K]>,
  N extends (data: Awaited<ReturnType<THttpApi[K]>>) => any,
>(
  httpKey: K,
  args: A,
  normalizer: N,
): N extends (data: any) => infer T ? IHookResponse<T | null> : never;

function useHttpRequestOnMount(
  httpKey: THttpRequestKey,
  args: any[],
  normalizer?: (data: Awaited<ReturnType<THttpApi[THttpRequestKey]>>) => any,
) {
  const [data, setData] = useState<any>(null);
  const request = httpApi[httpKey];

  useEffect(() => {
    request(args as never).then((data) =>
      setData(normalizer ? normalizer(data) : data),
    );
  }, args);

  return { data, setData };
}

export { useHttpRequestOnMount };
