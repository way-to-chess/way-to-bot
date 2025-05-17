import {getNotNil} from "../utils/getNotNil";

const getEnv = (name: string) => {
    // @ts-expect-error For Sanya
    return getNotNil(import.meta.env[`VITE_${name}`], ` add 'VITE_${name}' to .evn file`);
};

const BASE_API_URL = getEnv("API_URL");

const FILE_API_URL = getEnv("FILE_API_URL");

export {BASE_API_URL, FILE_API_URL};
