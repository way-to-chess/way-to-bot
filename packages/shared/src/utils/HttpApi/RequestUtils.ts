// import { IWithError } from "../../interfaces/error.interface";
// import { BASE_API_URL } from "../../constants/envs";
//
// const simpleGetRequest = <Response>(
//   endpoint: string,
// ): (() => Promise<Response | IWithError>) => {
//   return () =>
//     fetch(`${BASE_API_URL}/${endpoint}`)
//       .then((response) => {
//         try {
//           return response.json();
//         } catch (error) {
//           return { error };
//         }
//       })
//       .catch((reason) => ({ error: reason }));
// };
//
// const requestWithPayload = <P extends Record<string, any>, R>(
//   method: RequestInit["method"],
//   endpoint: string,
// ) => {
//   return (payload: P): Promise<R | IWithError> =>
//     fetch(`${BASE_API_URL}/${endpoint}`, {
//       body: JSON.stringify(payload),
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method,
//     })
//       .then((response) => {
//         try {
//           return response.json();
//         } catch (error) {
//           return { error };
//         }
//       })
//       .catch((reason) => {
//         return { error: reason };
//       });
// };
//
// export { simpleGetRequest, requestWithPayload };
