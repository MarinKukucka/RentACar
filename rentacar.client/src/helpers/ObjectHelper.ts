/* eslint-disable @typescript-eslint/no-explicit-any */
type ObjectWithKeys = Record<string, any>;

export const replaceDotsWithUnderscore = (obj: ObjectWithKeys): void => {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = key.replace(/\./g, '_');

            if (newKey !== key) {
                obj[newKey] = obj[key];
                delete obj[key];
            }
        }
    }
};
