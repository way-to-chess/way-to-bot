interface IWithRequestSymbol {
  requestSymbol: symbol;
}

enum ERequestStatus {
  idle = "IDLE",
  loading = "LOADING",
  error = "ERROR",
  success = "SUCCESS",
}

export { ERequestStatus };
export type { IWithRequestSymbol };
