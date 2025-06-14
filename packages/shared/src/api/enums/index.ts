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

export enum EFileAssigment {
  AVATAR = "avatar",
  RECEIPT = "receipt",
  LOCATION = "location",
  EVENT = "event",
  ROUNDS_CSV = "rounds_csv",
  RATING_CSV = "rating_csv",
}

export enum EContactType {
  TELEGRAM = "telegram",
  EMAIL = "email",
}

export enum ELocationBenefits {
  FOOD = "food",
  DRINKS = "drinks",
  ALCOHOL = "alcohol",
  PHOTO = "photo",
  VIDEO = "video",
  WC = "wc",
}

export enum EPredicate {
  AND = "AND",
  OR = "OR",
}

export enum EOperandPredicate {
  EQ = "EQ",
  NOT_EQ = "NOT_EQ",
  IN = "IN",
  NOT_IN = "NOT_IN",
  LIKE = "LIKE",
}

export enum ESortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export enum EParticipateRequestStatus {
  WAITING = "waiting",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum EParticipateRequestPaymentType {
  CASH = "cash",
  ONLINE = "online",
  RECEIPT = "receipt",
}
