export enum EEventStatus {
  WAITING = "waiting",
  STARTED = "started",
  FINISHED = "finished",
}

export enum EUserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum EHttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum EErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export enum EClientFileAssigment {
  AVATAR = "avatar",
  RECEIPT = "receipt",
}

export enum EAdminFileAssigment {
  ROUNDS = "rounds",
  RATING = "rating",
}
