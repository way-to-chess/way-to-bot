import * as constants from "./constants";

export const validateConstants = () => {
  return Object.entries(constants).reduce((pr: string[], [key, value]) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      pr.push(key);
    }
    return pr;
  }, []);
};
