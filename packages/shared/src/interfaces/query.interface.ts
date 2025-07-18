import { ESortDirection } from "../api/enums/ESortDirection.js";
import { EPredicate } from "../api/enums/EPredicate.js";

interface IWhereInput {
  field: string;
  value: string | string[];
  predicate: EPredicate;
}

interface IOrderByInput {
  field: string;
  direction: ESortDirection;
}

interface ILimitInput {
  limit: number;
  offset: number;
}

interface IQueryOptions {
  where?: IWhereInput;
  sort?: IOrderByInput;
  pagination?: ILimitInput;
}

export type { IQueryOptions, IWhereInput };
