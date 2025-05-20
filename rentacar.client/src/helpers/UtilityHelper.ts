/* eslint-disable @typescript-eslint/no-explicit-any */
export const get = (obj: any, path: string): any => {
    const result = path.split('.').reduce((r, p) => {
        if (typeof r === 'object') {
            p = p.startsWith('[') ? p.replace(/\D/g, '') : p;

            return r[p];
        }

        return undefined;
    }, obj);

    return result;
};

export const enumToSelectItems = <T extends object>(enumObj: T) => {
    return (
        Object.entries(enumObj)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, value]) => typeof value === 'number')
            .map(([key, value]) => ({
                value: value,
                label: key.replace(/([A-Z])/g, ' $1').trim(),
            }))
    );
};

export const elipsisString = (str: string, n: number): string => {
    if (str.length <= n) return str;
    return str.slice(0, n).trimEnd() + '...';
};
