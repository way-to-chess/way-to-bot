const getNotNil = <T>(candidate: T, entity: string): NonNullable<T> => {
  if (!candidate) {
    throw `GET NOT NIL ERROR FROM ENTITY: ${entity}`;
  }

  return candidate;
};

export { getNotNil };
