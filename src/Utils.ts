export type RectangledObject = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type UnitConverterFunction = (x: number) => number;
export type Units = {
    [key: string]: number | UnitConverterFunction;
}

export const produceValue = (baseValue: number, specified: string): [number, string] | number | null => {
    const digitMatch = /^(-?\d+(?:\.\d+)?)(px|%)$/.exec(specified);

    if (digitMatch) {
        const [, base, factor] = digitMatch;

        return factor === 'px'
            ? parseFloat(base)
            : parseFloat(base) / 100 * baseValue;
    }

    const asteriskMatch = /^(-?\d+(?:\.\d+)?)?([a-z]+)$/.exec(specified);

    if (asteriskMatch) {
        const multiplier = asteriskMatch[1];
        const unit = asteriskMatch[2];

        return [parseFloat(multiplier) || 1, unit];
    }

    return null;
};

export const isValidSize = (size: string): boolean => {
    return /^(-?\d+(?:\.\d+)?(px|%)|(\d+(?:\.\d+)?)?([a-z]+))$/.test(size);
};

export const smartProduceValue = (value: string, baseValue: number, customUnits: Units):
    [number, string] | number | null => {
    const result = produceValue(baseValue, value);
    if (Array.isArray(result)) {
        const [coef, factor] = result;
        if (factor !== 'fr') {
            if (customUnits[factor]) {
                const data = customUnits[factor];
                if (data instanceof Function) {
                    return data(coef);
                }

                return data * coef;
            }

            return coef;
        }

        return [coef, factor];
    }

    return result;
};

export const defaultsToNumber = (value: number | unknown, defaultValue: number): number =>
    (typeof value === 'number' ? value : defaultValue);
