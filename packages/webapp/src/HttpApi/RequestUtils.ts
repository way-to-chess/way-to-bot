import { IWithError } from "../Models/IError.ts";

const BASE_API_URL = import.meta.env.VITE_API_URL;

try {
  new URL(BASE_API_URL);
} catch {
  const errorMessage =
    "VITE_API_URL not specified or not valid -> check .env file";

  const span = document.createElement("span");
  span.innerText = errorMessage;
  span.style.color = "red";

  document.body.appendChild(span);

  throw errorMessage;
}

const simpleGetRequest = <Response>(
  endpoint: string,
): (() => Promise<Response | IWithError>) => {
  return async () => {
    const response = await fetch(`${BASE_API_URL}/${endpoint}`);
    if (!response.ok) {
      console.error(response.statusText);

      return { error: response.statusText };
    }
    return (await response.json()) as Response;
  };
};

const requestWithPayload = <P extends Record<string, any>, R>(
  method: RequestInit["method"],
  endpoint: string,
) => {
  return async (payload: P): Promise<R | IWithError> => {
    const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method,
    });
    if (!response.ok) {
      console.error(response.statusText);

      return { error: response.statusText };
    }
    return await response.json();
  };
};

export { simpleGetRequest, requestWithPayload, BASE_API_URL };
