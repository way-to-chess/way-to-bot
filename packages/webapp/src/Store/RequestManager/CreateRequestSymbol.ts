const createRequestSymbol = (requestName: string): symbol =>
  Symbol(`REQUEST_${requestName}`);

export { createRequestSymbol };
