const getUserFullName = (name?: string | null, surname?: string | null) => {
    if (name && surname) {
        return `${name} ${surname}`;
    }

    return name ?? "Без Имени";
};

export {getUserFullName};
