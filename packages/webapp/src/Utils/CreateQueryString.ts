const createQueryString = (
  params: Record<string, string | number | boolean | undefined>,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    searchParams.append(key, value.toString());
  });
  const queryString = searchParams.toString();

  return queryString && `?${queryString}`;
};

export { createQueryString };
