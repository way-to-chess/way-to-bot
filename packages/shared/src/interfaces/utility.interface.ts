export type TExtractData<T> = T extends { data: infer V } ? V : never
