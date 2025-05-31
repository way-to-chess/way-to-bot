import { EPredicate, ESortDirection } from "../api/enums";

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
  where?: IWhereInput[];
  orderBy?: IOrderByInput;
  limit?: ILimitInput;
}

export type { IQueryOptions, IWhereInput };
