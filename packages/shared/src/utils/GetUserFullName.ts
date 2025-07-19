const getUserFullName = (name?: string | null, surname?: string | null) => {
    if (name && surname) {
        return `${name} ${surname}`;
    }

    return name ?? "No Name";
};

export {getUserFullName};
