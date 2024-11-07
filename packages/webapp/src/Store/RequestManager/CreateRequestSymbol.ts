const createRequestSymbol = (requestName: string): string =>
  `REQUEST_${requestName}`;

export { createRequestSymbol };
