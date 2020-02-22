import {/* isValidSize, smartProduceValue, */ RectangledObject, /* Units */} from './Utils';

export type Shift = {
    x: number | string;
    y: number | string;
}
export type RegionConfig = {
    column: string;
    row: string;
    scale?: number;
    shift?: Shift;
}
export type RegionDictionary = {
    [name: string]: RegionConfig;
}
export enum AlignRule {
    End = 'end',
    Center = 'center',
    SpaceAround = 'space-around',
    SpaceBetween = 'space-between',
    SpaceEvenly = 'space-evenly',
    Start = 'start',
}
export type GridLayoutConfig = {
    templateColumns: string,
    templateRows: string,
    justifyContent?: AlignRule,
    alignContent?: AlignRule,
    gap?: string,
    regions: RegionDictionary;
}
export type KeyRegionTuple = [string, RectangledObject];

export type AreaConstructor = (x: number, y: number, width: number, height: number) => any;

export type NamedItems = {
    [name: string]: number;
}
export type CalculatedAxisItem = {
    name: string | null;
    value: string;
}
export type CalculatedAxisData = {
    items: Array<CalculatedAxisItem>;
    endName: string|null;
    namedItems: NamedItems;
}
export type CalculatedAxisDataWithGap = {
    items: Array<CalculatedAxisItem>;
    endName: string|null;
    namedItems: NamedItems;
    gap: string;
}

export type CalculatedBothAxisData = {
    columns: CalculatedAxisData,
    rows: CalculatedAxisData
}

export default class GridLayout {
    static defaultAreaConstructor(x: number, y: number, width: number, height: number): RectangledObject {
        return {x, y, width, height};
    }

    /*
    // example of area constructor function
    static phaserAreaConstructor(x: number, y: number, width: number, height: number): RectangledObject {
        return new Phaser.Rectangle(x, y, width, height);
    }
    */

    /**
     * @param {{x, y, width, height}} root
     * @param {object} layout
     * @param {function} areaConstructor
     * @param {object} customUnits key-value pair are {number|function} which produces final value
     * @return {object}
     */
    /* static calculate(root: RectangledObject, layout: GridLayoutConfig,
                     areaConstructor: AreaConstructor = this.defaultAreaConstructor, customUnits: Units = {}) {
        return this.calculateRegions(root, layout, {
            vw: root.width / 100,
            vh: root.height / 100,
            vmin: Math.min(root.width, root.height) / 100,
            vmax: Math.max(root.width, root.height) / 100,
            ...customUnits
        })
            .map(([key, {x, y, width, height}]) => [key, areaConstructor(x, y, width, height)])
            .reduce((p, [key, value]) => ({...p, [key]: value}), {});
    } */

    /**
     * Main method
     * @param {{x, y, width, height}} root
     * @param {object} layout
     * @param {object} customUnits key-value pair are {number|function} which produces final value
     */
    /* static calculateRegions(root: RectangledObject, layout: GridLayoutConfig, customUnits: Units = {}) {
        const gridData = this.parseGridData(layout);
        const {justifyContent, alignContent, gap} = layout;
        const [rowGap, columnGap] = (gap || '0% 0%').trim().split(/\s+/).map(s => s.trim());

        const columns = this.calculateFinalRowData(
            root.width, columnGap || rowGap, justifyContent, gridData.columns, customUnits
        );
        const rows = this.calculateFinalRowData(
            root.height, rowGap, alignContent, gridData.rows, customUnits
        );
        const regions = layout.regions || {};

        return Object.entries(regions)
            .map(([regionName, regionData]) => {
                const {column, row, scale: customScale, shift: customShift} = regionData;
                const scale = {
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

                const [fromColumn, untilColumn] = this.parseRegionColumns(column, columns);
                const [fromRow, untilRow] = this.parseRegionColumns(row, rows);

                const extractOffsetAndSize = (fromItem, untilItem, data) => {
                    const from = data.items[fromItem - 1];
                    const until = data.items[untilItem - 2];

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
                result.x += smartProduceValue(
                    typeof shift.x === 'number' ? `${shift.x}px` : shift.x,
                    root.width, customUnits);
                result.y += smartProduceValue(
                    typeof shift.y === 'number' ? `${shift.y}px` : shift.y,
                    root.height, customUnits);

                return [
                    regionName,
                    result
                ];
            });
    } */

    static parseRegionColumns(str: string, data: CalculatedAxisData): [number, number] {
        if (/.+\/.+/.test(str)) {
            const [fromStr, restStr] = str.split('/').map(s => s.trim());
            const extractNumberOrLabel = (numOrLabel: string) => {
                if (!/^\d+$/.test(numOrLabel)) {
                    if (data.namedItems[numOrLabel]) {
                        return data.namedItems[numOrLabel];
                    }
                } else {
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
            const testMatch = restStr.match(/^span\s+(\d+)$/);
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
    }

    /**
     * Calculates final column/row data
     * @param {number} baseValue
     * @param {string} gapValue
     * @param {'start'|'end'|'center'|'space-around'|'space-between'|'space-evenly'} alignContent
     * @param {{items: {name:string,value:string}[], endName: string|null, namedItems}} data
     * @param {object} customUnits key-value pair are {number|function} which produces final value
     * @return {{items:{name:string,value:string}[], endName: string|null, gap: number, namedItems}}
     */
    /* static calculateFinalRowData(
        baseValue: number, gapValue: string, alignContent: AlignRule,
        data: CalculatedAxisData, customUnits: Units = {}) {
        const gap = smartProduceValue(gapValue, baseValue, customUnits);
        const items: Array<CalculatedAxisItem> = data.items.map(obj => ({...obj}));
        const endName = data.endName;
        const namedItems = data.namedItems;
        const columnCount = items.length;

        const baseSizes = items
            .map(item => smartProduceValue(
                isValidSize(item.value) ? item.value : 'fr',
                baseValue, customUnits
            ));
        const stretchCoeffSum = baseSizes
            .reduce((p, c) => p + (Array.isArray(c) && c[1] === 'fr' ? c[0] : 0), 0);

        if (stretchCoeffSum) {
            const constHeightsSum = baseSizes
                .reduce((p, c) => p + (!Array.isArray(c) ? c : 0), 0);
            const baseCoeff = (baseValue - constHeightsSum - gap * (items.length - 1)) /
                stretchCoeffSum;

            baseSizes
                .forEach((val, index) => {
                    if (Array.isArray(val) && val[1] === 'fr') {
                        baseSizes[index] = baseCoeff * val[0];
                    }
                });
        }

        const baseSizesSum = baseSizes.reduce((p, c) => p + c, 0);
        const baseSizesSumWithGaps = baseSizesSum + gap * (columnCount - 1);

        let offset = 0;
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            item.value = baseSizes[index];
            item.offset = offset;
            offset += item.value + gap;
        }

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
                    item.value = baseSizes[index];
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
    } */

    static parseGridData(layout: GridLayoutConfig): CalculatedBothAxisData {
        const {templateColumns, templateRows} = layout;

        return {
            columns: this.parseColumnString(templateColumns),
            rows: this.parseColumnString(templateRows),
        };
    }

    /**
     * Parsing single column string
     */
    static parseColumnString(str: string): CalculatedAxisData {
        const data = str.trim().split(/\s+/);
        const items: Array<CalculatedAxisItem> = [];
        let endName = null;
        const namedItems: NamedItems = {}; // "name => index" hash map

        let name = null;
        for (let i = 0; i < data.length; i++) {
            const nameMatch = data[i].match(/^\[(.+)\]$/);
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
    }
}
