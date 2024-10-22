const getUserFullName = (name?: string, surname?: string) => {
  if (name && surname) {
    return `${name} ${surname}`;
  }

  return name ?? "No Name";
};

export { getUserFullName };
