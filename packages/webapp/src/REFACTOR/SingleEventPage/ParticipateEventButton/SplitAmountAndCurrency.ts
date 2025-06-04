const splitAmountAndCurrency = (input: string) => input.split('').reduce((acc, char) => {
    if (/\d/.test(char)) {
        acc[0] += char
        return acc
    }

    acc[1] += char
    return acc

}, ["", ""])

export {splitAmountAndCurrency}