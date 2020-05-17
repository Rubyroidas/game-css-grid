import {isValidSize, smartProduceValue, RectangledObject, Units, defaultsToNumber} from './Utils';

export enum AlignRule {
    End = 'end',
    Center = 'center',
    SpaceAround = 'space-around',
    SpaceBetween = 'space-between',
    SpaceEvenly = 'space-evenly',
    Start = 'start',
}

export type Shift = {
    x: number | string;
    y: number | string;
}
export type Scale = {
    x: number;
    y: number;
}
export type RegionConfig = {
    column: string;
    row: string;
    scale?: number | Scale;
    shift?: Shift;
}
export type RegionDictionary = {
    [name: string]: RegionConfig;
}
export type GridLayoutConfig = {
    templateColumns: string;
    templateRows: string;
    justifyContent?: AlignRule;
    alignContent?: AlignRule;
    gap?: string;
    regions: RegionDictionary;
}
export type KeyRegionTuple = [string, RectangledObject];
export type AreaConstructor<T> = (x: number, y: number, width: number, height: number) => T;
export type NamedItems = {
    [name: string]: number;
}
export type RawAxisItem = {
    name: string | null;
    value: string;
}
export type CalculatedAxisItemWithOffset = {
    name: string | null;
    value: number;
    offset: number;
}
export type RawParsedAxisData = {
    items: Array<RawAxisItem>;
    endName: string | null;
    namedItems: NamedItems;
}

export const defaultAreaConstructor =
    (x: number, y: number, width: number, height: number): RectangledObject =>
        ({x, y, width, height});

/**
 * Parsing single column string
 */
export const parseColumnString = (str: string): RawParsedAxisData => {
    const data = str.trim().split(/\s+/);
    const items: Array<RawAxisItem> = [];
    let endName = null;
    const namedItems: NamedItems = {}; // "name => index" hash map

    let name = null;
    for (let i = 0; i < data.length; i++) {
        const nameMatch = /^\[(.+)\]$/.exec(data[i]);
        if (nameMatch) {
            if (i === data.length - 1) {
                endName = nameMatch[1];
            } else {
                name = nameMatch[1];
            }
        } else {
            items.push({
                name,
                value: data[i]
            });
            if (name) {
                namedItems[name] = items.length;
            }

            name = null;
        }
    }
    if (endName) {
        namedItems[endName] = items.length + 1;
    }
    return {items, endName, namedItems};
};

/**
 * Calculates final column/row data
 */
export const calculateFinalRowData = (
    baseValue: number, gapValue: string, alignContent: AlignRule | undefined,
    data: {items: {name: string|null; value: string}[]; endName: string|null; namedItems: NamedItems},
    customUnits: Units = {}
): {
    items: {name: string|null; value: number; offset: number}[];
    endName: string | null;
    namedItems: NamedItems;
    gap: number;
} => {
    const baseSizes: Array<[number, string] | number> = data.items
        .map(item => smartProduceValue(
            isValidSize(item.value) ? item.value : 'fr',
            baseValue, customUnits
        ))
        .filter(<T>(item: T | null): item is T => item !== null)
        .filter(item => typeof item === 'number' || Array.isArray(item) && item[1] === 'fr');
    if (baseSizes.length < data.items.length) {
        return {
            items: [],
            endName: null,
            gap: 0,
            namedItems: {}
        };
    }

    const gap: number = defaultsToNumber(smartProduceValue(gapValue, baseValue, customUnits), 0);
    const endName = data.endName;
    const namedItems = data.namedItems;
    const columnCount = data.items.length;

    // working with 'fr' sizes
    const stretchCoeffSum: number = baseSizes
        .reduce(
            (p: number, c: [number, string] | number): number => p + (Array.isArray(c) ? c[0] : 0),
            0
        );

    const finalSizes: Array<number> = baseSizes
        .map((val: [number, string] | number): number => {
            if (Array.isArray(val)) {
                return 0;
            }

            return val;
        });

    if (stretchCoeffSum > 0) {
        // not 'fr' items sum
        const constHeightsSum: number = baseSizes
            .reduce(
                (p: number, c: [number, string] | number): number => p + (!Array.isArray(c) ? c : 0),
                0
            );
        // 'fr' base coeff, size per 1fr
        const baseCoeff: number = (baseValue - constHeightsSum - gap * (data.items.length - 1)) /
            stretchCoeffSum;

        baseSizes
            .forEach((val: [number, string] | number, index: number) => {
                if (Array.isArray(val)) {
                    finalSizes[index] = baseCoeff * val[0];
                }
            });
    }

    const baseSizesSum: number = finalSizes.reduce((p, c) => p + c, 0);
    const baseSizesSumWithGaps: number = baseSizesSum + gap * (columnCount - 1);

    let offset = 0;
    const items: Array<{name: string|null; value: number; offset: number}> = data.items.map((obj, index) => {
        const item = {
            name: obj.name,
            value: finalSizes[index],
            offset,
        };

        offset += item.value + gap;

        return item;
    });

    switch (alignContent) {
        case 'end': {
            const offset = baseValue - baseSizesSumWithGaps;
            items.forEach(item => {
                item.offset += offset;
            });
        }
            break;
        case 'center': {
            const offset = (baseValue - baseSizesSumWithGaps) / 2;
            items.forEach((item, index) => {
                item.value = finalSizes[index];
                item.offset += offset;
            });
        }
            break;
        case 'space-around': {
            const offset = (baseValue - baseSizesSumWithGaps) / columnCount;
            items.forEach((item, index) => {
                item.offset += index * offset + offset / 2;
            });
        }
            break;
        case 'space-between': {
            const offset = (baseValue - baseSizesSumWithGaps) / (columnCount - 1);
            items.forEach((item, index) => {
                item.offset += index * offset;
            });
        }
            break;
        case 'space-evenly': {
            const offset = (baseValue - baseSizesSumWithGaps) / (columnCount + 1);
            items.forEach((item, index) => {
                item.offset += (index + 1) * offset;
            });
        }
            break;
        case 'start':
        default:
        // do nothing, it's already from start
    }

    return {items, endName, namedItems, gap};
};

export const parseRegionColumns = (str: string, data: RawParsedAxisData): [number, number] => {
    if (/.+\/.+/.test(str)) {
        const [fromStr, restStr] = str.split('/').map(s => s.trim());
        const extractNumberOrLabel = (numOrLabel: string): number => {
            if (!/^\d+$/.test(numOrLabel)) {
                // not a number - label
                if (data.namedItems[numOrLabel]) {
                    return data.namedItems[numOrLabel];
                }
            } else {
                // a number
                return Math.min(
                    data.items.length + 1,
                    Math.max(1, parseInt(numOrLabel, 10))
                );
            }

            return 1;
        };

        // from
        const fromItem = extractNumberOrLabel(fromStr);

        // until
        const testMatch = /^span\s+(\d+)$/.exec(restStr);
        if (testMatch) {
            // span
            const span = parseInt(testMatch[1], 10);
            return [fromItem, fromItem + span];
        }

        // regular
        const untilItem = extractNumberOrLabel(restStr);
        return [fromItem, untilItem];
    }

    return [1, 1];
};

/**
 * Main method doing background stuff
 */
export const calculateRegions = (root: RectangledObject, layout: GridLayoutConfig, customUnits: Units = {}):
    Array<KeyRegionTuple> => {
    const gridData = {
        columns: parseColumnString(layout.templateColumns),
        rows: parseColumnString(layout.templateRows),
    };
    const {justifyContent, alignContent, gap} = layout;
    const [rowGap, columnGap] = (gap || '0% 0%').trim().split(/\s+/).map(s => s.trim());

    const columns = calculateFinalRowData(
        root.width, columnGap || rowGap, justifyContent, gridData.columns, customUnits
    );
    const rows = calculateFinalRowData(
        root.height, rowGap, alignContent, gridData.rows, customUnits
    );
    const regions = layout.regions || {};

    return Object.entries(regions)
        .map(([regionName, regionData]) => {
            const {column, row, scale: customScale, shift: customShift} = regionData;
            const scale: Scale = {
                x: 1, y: 1,
                ...(typeof customScale === 'number'
                    ? {x: customScale, y: customScale}
                    : (customScale || {}))
            };
            const shift = {
                x: 0, y: 0,
                ...(customShift || {})
            };
            const result = {x: 0, y: 0, width: 0, height: 0};

            const [fromColumn, untilColumn] = parseRegionColumns(column, gridData.columns);
            const [fromRow, untilRow] = parseRegionColumns(row, gridData.rows);

            const extractOffsetAndSize = (fromItem: number, untilItem: number, data: {
                items: {name: string|null; value: number; offset: number}[];
            }): [number, number] => {
                const from: CalculatedAxisItemWithOffset = data.items[fromItem - 1];
                const until: CalculatedAxisItemWithOffset = data.items[untilItem - 2];

                return [from.offset, until.offset + until.value - from.offset];
            };

            [result.x, result.width] = extractOffsetAndSize(fromColumn, untilColumn, columns);
            [result.y, result.height] = extractOffsetAndSize(fromRow, untilRow, rows);

            // final offset from root region
            result.x += root.x;
            result.y += root.y;

            // custom scaling
            result.x -= result.width * (scale.x - 1) / 2;
            result.y -= result.height * (scale.y - 1) / 2;

            result.width *= scale.x;
            result.height *= scale.y;

            // custom shifting
            result.x += defaultsToNumber(smartProduceValue(
                typeof shift.x === 'number' ? `${shift.x}px` : shift.x,
                root.width, customUnits), 0);
            result.y += defaultsToNumber(smartProduceValue(
                typeof shift.y === 'number' ? `${shift.y}px` : shift.y,
                root.height, customUnits), 0);

            return [
                regionName,
                result
            ];
        });
};

/**
 * This is the face of the whole module
 */
export const calculate = <T>(root: RectangledObject, layout: GridLayoutConfig,
    areaConstructor: AreaConstructor<T>, customUnits: Units = {}): {
    [key: string]: T;
} => {
    const rectTouples = calculateRegions(root, layout, {
        vw: root.width / 100,
        vh: root.height / 100,
        vmin: Math.min(root.width, root.height) / 100,
        vmax: Math.max(root.width, root.height) / 100,
        ...customUnits
    });

    const tTouples: Array<[string, T]> = rectTouples
        .map(([key, {x, y, width, height}]): [string, T] =>
            [key, areaConstructor(x, y, width, height)]);

    return tTouples
        .reduce((p, [key, value]) => ({...p, [key]: value}), {});
};
