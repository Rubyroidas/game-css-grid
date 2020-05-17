import {
    AlignRule,
    calculate,
    calculateFinalRowData,
    calculateRegions,
    GridLayoutConfig,
    parseColumnString,
    parseRegionColumns,
    defaultAreaConstructor
} from './GridLayout';

describe('parseColumnString: parse column data', () => {
    test('simple 1', () => {
        const parsed = parseColumnString('20% 60% 20%');
        const expected = {
            items: [{
                name: null,
                value: '20%'
            }, {
                name: null,
                value: '60%'
            }, {
                name: null,
                value: '20%'
            }],
            endName: null,
            namedItems: {},
        };
        expect(parsed).toEqual(expected);
    });
    test('simple 2', () => {
        const parsed = parseColumnString('1fr 2fr 1fr');
        const expected = {
            items: [{
                name: null,
                value: '1fr'
            }, {
                name: null,
                value: '2fr'
            }, {
                name: null,
                value: '1fr'
            }],
            endName: null,
            namedItems: {},
        };
        expect(parsed).toEqual(expected);
    });
    test('with labels 1', () => {
        const parsed = parseColumnString('[start] 1fr 2fr 1fr');
        const expected = {
            items: [{
                name: 'start',
                value: '1fr'
            }, {
                name: null,
                value: '2fr'
            }, {
                name: null,
                value: '1fr'
            }],
            endName: null,
            namedItems: {
                start: 1
            },
        };
        expect(parsed).toEqual(expected);
    });
    test('with labels 2', () => {
        const parsed = parseColumnString('[start] 1fr 2fr 1fr [end]');
        const expected = {
            items: [{
                name: 'start',
                value: '1fr'
            }, {
                name: null,
                value: '2fr'
            }, {
                name: null,
                value: '1fr'
            }],
            endName: 'end',
            namedItems: {
                start: 1,
                end: 4,
            },
        };
        expect(parsed).toEqual(expected);
    });
    test('with labels 3', () => {
        const parsed = parseColumnString('[start] 1fr [left] 2fr 1fr [end]');
        const expected = {
            items: [{
                name: 'start',
                value: '1fr'
            }, {
                name: 'left',
                value: '2fr'
            }, {
                name: null,
                value: '1fr'
            }],
            endName: 'end',
            namedItems: {
                start: 1,
                left: 2,
                end: 4,
            },
        };
        expect(parsed).toEqual(expected);
    });
});

describe('parseRegionColumns: pick columns', () => {
    const columnData = parseColumnString('[first] 20% [left] 60% [right] 20% [last]');
    test('pick 1', () => {
        const parsed = parseRegionColumns('1 / 2', columnData);
        const expected = [1, 2];
        expect(parsed).toEqual(expected);
    });
    test('pick 1-2', () => {
        const parsed = parseRegionColumns('1 / 3', columnData);
        const expected = [1, 3];
        expect(parsed).toEqual(expected);
    });
    test('pick 1-4', () => {
        const parsed = parseRegionColumns('1 / 4', columnData);
        const expected = [1, 4];
        expect(parsed).toEqual(expected);
    });
    test('pick 1-last', () => {
        const parsed = parseRegionColumns('1 / 4', columnData);
        const expected = [1, 4];
        expect(parsed).toEqual(expected);
    });
    test('pick 2-3', () => {
        const parsed = parseRegionColumns('2 / 3', columnData);
        const expected = [2, 3];
        expect(parsed).toEqual(expected);
    });
    test('pick 2 span 2', () => {
        const parsed = parseRegionColumns('2 / span 2', columnData);
        const expected = [2, 4];
        expect(parsed).toEqual(expected);
    });
    test('pick left span 2', () => {
        const parsed = parseRegionColumns('left / span 2', columnData);
        const expected = [2, 4];
        expect(parsed).toEqual(expected);
    });
    test('pick left-3', () => {
        const parsed = parseRegionColumns('left / 3', columnData);
        const expected = [2, 3];
        expect(parsed).toEqual(expected);
    });
    test('pick 2-right', () => {
        const parsed = parseRegionColumns('2 / right', columnData);
        const expected = [2, 3];
        expect(parsed).toEqual(expected);
    });
    test('pick left-right', () => {
        const parsed = parseRegionColumns('left / right', columnData);
        const expected = [2, 3];
        expect(parsed).toEqual(expected);
    });
});

describe('calculateFinalRowData', () => {
    test('pick 1', () => {
        const parsed = calculateFinalRowData(100, '', AlignRule.Start, {
            items: [
                { name: 'first', value: '20%' },
                { name: 'left', value: '60%' },
                { name: 'right', value: '20%' }
            ],
            endName: 'last',
            namedItems: { first: 1, left: 2, right: 3, last: 4 }
        });
        const expected = {
            endName: 'last',
            gap: 0,
            items: [
                { name: 'first', value: 20, offset: 0 },
                { name: 'left', value: 60, offset: 20 },
                { name: 'right', value: 20, offset: 80 }
            ],
            namedItems: { first: 1, left: 2, right: 3, last: 4 }
        };
        expect(parsed).toEqual(expected);
    });
});

describe('calculateRegions', () => {
    test('pick 1', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout = {
            templateColumns: '[first] 20% [left] 60% [right] 20% [last]',
            templateRows: '20% 60% 20%',
            regions: {
                root: {
                    column: '2 / 4',
                    row: '2 / span 2',
                },
            },
        };
        const parsed = calculateRegions(area, layout);
        const expected = [
            ['root', {
                x: 40,
                y: 80,
                width: 160,
                height: 320,
            }]
        ];
        expect(parsed).toEqual(expected);
    });
});

describe('calculate: simple', () => {
    test('layout 1', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            templateColumns: '[first] 20% [left] 60% [right] 20% [last]',
            templateRows: '20% 60% 20%',
            regions: {
                root: {
                    column: '2 / 4',
                    row: '2 / span 2',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 40,
                y: 80,
                width: 160,
                height: 320,
            }
        };
        expect(parsed).toEqual(expected);
    });
    test('layout 2', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            templateColumns: '[first] 20% [left] 60% [right] 20% [last]',
            templateRows: '20% 60% 20%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 40,
                y: 80,
                width: 160,
                height: 320,
            }
        };
        expect(parsed).toEqual(expected);
    });
    test('layout 3', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            templateColumns: '[first] 20% [left] 60% [right] 20% [last]',
            templateRows: '[begin] 20% [top] 60% [bottom] 20% [end]',
            regions: {
                root: {
                    column: 'left / right',
                    row: 'top / bottom',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 40,
                y: 80,
                width: 120,
                height: 240,
            }
        };
        expect(parsed).toEqual(expected);
    });
    test('layout 4: fr', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            templateColumns: '[start] 1fr [left] 20px [right] 1fr [last]',
            templateRows: '[start] 1fr [mid] 1fr [end]',
            regions: {
                root: {
                    column: 'start / left',
                    row: 'mid / end',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 0,
                y: 200,
                width: 90,
                height: 200,
            }
        };
        expect(parsed).toEqual(expected);
    });
});
describe('calculate: simple + gaps', () => {
    test('layout 1', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            gap: '5% 5%',
            templateColumns: '[first] 20% [left] 50% [right] 20% [last]',
            templateRows: '20% 50% 20%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 50,
                y: 100,
                width: 150,
                height: 300,
            }
        };
        expect(parsed).toEqual(expected);
        expect(parsed).toEqual(expected);
    });
    test('layout 2 (vmin gap)', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            gap: '10vmin 5vmin',
            templateColumns: '[first] 20% [left] 50% [right] 20% [last]',
            templateRows: '20% 50% 20%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 50,
                y: 100,
                width: 150,
                height: 300,
            }
        };
        expect(parsed).toEqual(expected);
        expect(parsed).toEqual(expected);
    });
    test('layout 3', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            gap: '5% 5%',
            templateColumns: '[first] 20% [left] 50% [right] 20% [last]',
            templateRows: '[begin] 20% [top] 50% [bottom] 20% [end]',
            regions: {
                root: {
                    column: 'left / right',
                    row: 'top / bottom',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 50,
                y: 100,
                width: 100,
                height: 200,
            }
        };
        expect(parsed).toEqual(expected);
        expect(parsed).toEqual(expected);
    });
    test('layout 4: fr', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            templateColumns: '[start] 1fr [left] 20px [right] 1fr [last]', // |80| 10 |20| 10 |80|
            templateRows: '[start] 1fr [mid] 1fr [end]',
            gap: '5%',
            regions: {
                root: {
                    column: 'left / last',
                    row: 'mid / end',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 90,
                y: 210,
                width: 110,
                height: 190,
            }
        };
        expect(parsed).toEqual(expected);
    });
});
describe('calculate: simple + scaling + shift', () => {
    test('layout 1', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            templateColumns: '[first] 20% [left] 60% [right] 20% [last]',
            templateRows: '20% 60% 20%',
            regions: {
                root: {
                    column: '2 / 4',
                    row: '2 / span 2',
                    scale: 2,
                    shift: {
                        x: 10,
                        y: -10
                    }
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: -30,
                y: -90,
                width: 320,
                height: 640,
            }
        };
        expect(parsed).toEqual(expected);
    });
    test('layout 2', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            templateColumns: '[first] 20% [left] 60% [right] 20% [last]',
            templateRows: '20% 60% 20%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                    scale: {
                        x: 1.5,
                        y: 3
                    },
                    shift: {
                        x: '1vmin',
                        y: '-2vmax'
                    }
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 2,
                y: -248,
                width: 240,
                height: 960,
            }
        };
        expect(parsed).toEqual(expected);
    });
});
describe('calculate: alignContent', () => {
    test('layout 1: end', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            justifyContent: AlignRule.End,
            alignContent: AlignRule.End,
            templateColumns: '[first] 20% [left] 20% [right] 20% [last]',
            templateRows: '20% 20% 20%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 120,
                y: 240,
                width: 80,
                height: 160,
            }
        };
        expect(parsed).toEqual(expected);
        expect(parsed).toEqual(expected);
    });
    test('layout 2: center', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            justifyContent: AlignRule.Center,
            alignContent: AlignRule.Center,
            templateColumns: '[first] 20% [left] 20% [right] 20% [last]',
            templateRows: '20% 20% 20%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 80,
                y: 160,
                width: 80,
                height: 160,
            }
        };
        expect(parsed).toEqual(expected);
        expect(parsed).toEqual(expected);
    });
    test('layout 3: space-around', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            justifyContent: AlignRule.SpaceAround,
            alignContent: AlignRule.SpaceAround,
            templateColumns: '[first] 20% [left] 20% [mid] 20% [right] 20% [last]',
            templateRows: '20% 20% 20% 20%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
                second: {
                    column: 'left / span 1',
                    row: '1 / span 1',
                },
                third: {
                    column: '1 / span 1',
                    row: '1 / span 1',
                },
                fourth: {
                    column: 'mid / span 1',
                    row: '4 / span 1',
                },
            },
        };

        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 55,
                y: 110,
                width: 140,
                height: 180,
            },
            second: {
                x: 55,
                y: 10,
                width: 40,
                height: 80,
            },
            third: {
                x: 5,
                y: 10,
                width: 40,
                height: 80,
            },
            fourth: {
                x: 105,
                y: 310,
                width: 40,
                height: 80,
            },
        };
        expect(parsed).toEqual(expected);
    });
    test('layout 4: space-between', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            justifyContent: AlignRule.SpaceBetween,
            alignContent: AlignRule.SpaceBetween,
            templateColumns: '[first] 20% [left] 20% [right] 20% [last]',
            templateRows: '20% 20% 20%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
                second: {
                    column: 'left / span 1',
                    row: '1 / span 1',
                },
                third: {
                    column: '1 / span 1',
                    row: '1 / span 1',
                },
                fourth: {
                    column: 'first / span 1',
                    row: '3 / span 1',
                },
            },
        };

        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 80,
                y: 160,
                width: 120,
                height: 240,
            },
            second: {
                x: 80,
                y: 0,
                width: 40,
                height: 80,
            },
            third: {
                x: 0,
                y: 0,
                width: 40,
                height: 80,
            },
            fourth: {
                x: 0,
                y: 320,
                width: 40,
                height: 80,
            },
        };
        expect(parsed).toEqual(expected);
    });
    test('layout 5: space-evenly', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            justifyContent: AlignRule.SpaceEvenly,
            alignContent: AlignRule.SpaceEvenly,
            templateColumns: '[first] 20% [left] 20% [right] 20% [last]',
            templateRows: '20% 20% 20%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
                second: {
                    column: 'left / span 1',
                    row: '1 / span 1',
                },
                third: {
                    column: '1 / span 1',
                    row: '1 / span 1',
                },
                fourth: {
                    column: 'first / span 1',
                    row: '3 / span 1',
                },
            },
        };

        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 80,
                y: 160,
                width: 100,
                height: 200,
            },
            second: {
                x: 80,
                y: 40,
                width: 40,
                height: 80,
            },
            third: {
                x: 20,
                y: 40,
                width: 40,
                height: 80,
            },
            fourth: {
                x: 20,
                y: 280,
                width: 40,
                height: 80,
            },
        };
        expect(parsed).toEqual(expected);
    });
});
describe('calculate: alignContent + gaps', () => {
    test('layout 1: end', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            justifyContent: AlignRule.End,
            alignContent: AlignRule.End,
            templateColumns: '[first] 20% [left] 20% [right] 20% [last]', // |40| 10 |40| 10 |40|
            templateRows: '20% 20% 20%', // |80| 20 |80| 20 |80|
            gap: '5%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 110,
                y: 220,
                width: 90,
                height: 180,
            }
        };
        expect(parsed).toEqual(expected);
        expect(parsed).toEqual(expected);
    });
    test('layout 2: center', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            justifyContent: AlignRule.Center,
            alignContent: AlignRule.Center,
            templateColumns: '[first] 20% [left] 20% [right] 20% [last]',
            templateRows: '20% 20% 20%',
            gap: '5%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
            },
        };
        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 80,
                y: 160,
                width: 90,
                height: 180,
            }
        };
        expect(parsed).toEqual(expected);
        expect(parsed).toEqual(expected);
    });
    test('layout 3: space-around', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            justifyContent: AlignRule.SpaceAround,
            alignContent: AlignRule.SpaceAround,
            templateColumns: '[first] 20% [left] 20% [mid] 20% [right] 20% [last]',
            templateRows: '20% 20% 20% 20%',
            gap: '5%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
                second: {
                    column: 'left / span 1',
                    row: '1 / span 1',
                },
                third: {
                    column: '1 / span 1',
                    row: '1 / span 1',
                },
                fourth: {
                    column: 'mid / span 1',
                    row: '4 / span 1',
                },
            },
        };

        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 53.75,
                y: 107.5,
                width: 145,
                height: 185,
            },
            second: {
                x: 53.75,
                y: 2.5,
                width: 40,
                height: 80,
            },
            third: {
                x: 1.25,
                y: 2.5,
                width: 40,
                height: 80,
            },
            fourth: {
                x: 106.25,
                y: 317.5,
                width: 40,
                height: 80,
            },
        };
        expect(parsed).toEqual(expected);
    });
    test('layout 4: space-between', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            justifyContent: AlignRule.SpaceBetween,
            alignContent: AlignRule.SpaceBetween,
            templateColumns: '[first] 20% [left] 20% [right] 20% [last]',
            templateRows: '20% 20% 20%',
            gap: '5%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
                second: {
                    column: 'left / span 1',
                    row: '1 / span 1',
                },
                third: {
                    column: '1 / span 1',
                    row: '1 / span 1',
                },
                fourth: {
                    column: 'first / span 1',
                    row: '3 / span 1',
                },
            },
        };

        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 80,
                y: 160,
                width: 120,
                height: 240,
            },
            second: {
                x: 80,
                y: 0,
                width: 40,
                height: 80,
            },
            third: {
                x: 0,
                y: 0,
                width: 40,
                height: 80,
            },
            fourth: {
                x: 0,
                y: 320,
                width: 40,
                height: 80,
            },
        };
        expect(parsed).toEqual(expected);
    });
    test('layout 5: space-evenly', () => {
        const area = {x: 0, y: 0, width: 200, height: 400};
        const layout: GridLayoutConfig = {
            justifyContent: AlignRule.SpaceEvenly,
            alignContent: AlignRule.SpaceEvenly,
            templateColumns: '[first] 20% [left] 20% [right] 20% [last]',
            templateRows: '20% 20% 20%',
            gap: '5%',
            regions: {
                root: {
                    column: 'left / last',
                    row: '2 / span 2',
                },
                second: {
                    column: 'left / span 1',
                    row: '1 / span 1',
                },
                third: {
                    column: '1 / span 1',
                    row: '1 / span 1',
                },
                fourth: {
                    column: 'first / span 1',
                    row: '3 / span 1',
                },
            },
        };

        const parsed = calculate(area, layout, defaultAreaConstructor);
        const expected = {
            root: {
                x: 80,
                y: 160,
                width: 105,
                height: 210,
            },
            second: {
                x: 80,
                y: 30,
                width: 40,
                height: 80,
            },
            third: {
                x: 15,
                y: 30,
                width: 40,
                height: 80,
            },
            fourth: {
                x: 15,
                y: 290,
                width: 40,
                height: 80,
            },
        };
        expect(parsed).toEqual(expected);
    });
});
