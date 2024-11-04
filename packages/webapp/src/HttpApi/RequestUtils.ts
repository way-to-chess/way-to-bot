import { IWithError } from "../Models/IError";

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
  return () =>
    fetch(`${BASE_API_URL}/${endpoint}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return { error: response.statusText };
      })
      .catch((reason) => ({ error: reason }));
};

const requestWithPayload = <P extends Record<string, any>, R>(
  method: RequestInit["method"],
  endpoint: string,
) => {
  return (payload: P): Promise<R | IWithError> =>
    fetch(`${BASE_API_URL}/${endpoint}`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return { error: response.statusText };
      })
      .catch((reason) => {
        return { error: reason };
      });
};

export { simpleGetRequest, requestWithPayload, BASE_API_URL };
