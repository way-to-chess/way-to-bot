export const eventErrorHandler = (event: string, handler: Function) => {
    const handleError = (err: Error) => {
        console.error(`ERROR IN EVENT: "${event}". \n`, err);
    };

    return (...args: any[]) => {
        try {
            const ret = handler.apply(this, args);
            if (ret && typeof ret.catch === 'function') {
                // async handler
                ret.catch(handleError);
            }
        } catch (e: any) {
            // sync handler
            handleError(e);
        }
    };
};
