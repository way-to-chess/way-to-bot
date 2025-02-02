type TId = number;

interface IWithId {
  id: TId;
}

interface IWithRequestId {
  requestId: TId;
}

export type { IWithRequestId, IWithId };
