[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

# Game CSS Grid

This package is supposed to cut rectangular area into slices (smaller areas).
Regions can be absolute or stack positioned. Stack can be horizontal or vertical.
Units which used are:

- `px` pixels
- `%` percents
- `fr` proportional sizing (exactlty like in CSS Grid standard)
- `vw`, `vh`, `vmin` or `vmax` for relative sizing
- list of units is freely customizable

## Layout config

Config is an object describing a region.
Example of the config:

```javascript
{
    justifyContent: 'space-evenly',
    alignContent: 'space-evenly',
    templateColumns: '[first] 20% [left] 20% [right] 20% [last]',
    templateRows: '20% 20% 20%',
    gap: '5%',
    regions: {
        first: {
            column: 'left / last',
            row: '2 / span 2',
        },
        second: {
            column: 'left / span 1',
            row: '1 / span 1',
            shift: {
                x: '3vmin',
                y: 5
            }
        },
        third: {
            column: '1 / span 1',
            row: '1 / span 1',
            scale: 1.5
        },
        fourth: {
            column: 'first / span 1',
            row: '3 / span 1',
            scale: {
                x: 2,
                y: 2.5
            }
        },
    },
}
```

| property        | obligatory? | type   | description                                                                                                                                                                                                        |
| --------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| justifyContent  | no          | string | the same format as for CSS `justify-content` rule, except `stretch`<br/>`start` is default                                                                                                                         |
| alignContent    | no          | string | the same format as for CSS `align-content` rule, except `stretch`<br>`start` is default                                                                                                                            |
| templateColumns | yes         | string | the same format as for CSS `grid-template-columns` rule                                                                                                                                                            |
| templateRows    | yes         | string | the same format as for CSS `grid-template-rows` rule                                                                                                                                                               |
| gap             | no          | string | the same format as for CSS `grid-gap` rule                                                                                                                                                                         |
| regions         | yes         | object | Object with regions. Key is the name, value is object of this type:<br/>`{column: string, row: string}`<br/>where:<br/>`column` is the same as CSS `grid-column` rule<br/>`row` is the same as CSS `grid-row` rule |

## Usage

Given layout config is parsed into region tree. After that all regions become an array and all of them are calculated into finite rectangular objects.

```typescript
import {
    calculate,
    GridLayoutConfig,
    defaultAreaConstructor,
    RectangledObject,
    AlignRule
} from 'game-css-grid';

const layoutConfig: GridLayoutConfig = {
    templateColumns: '[first] 20% [left] 60% [right] 20% [last]',
    templateRows: '20% 60% 20%',
    justifyContent: AlignRule.Center,
    alignContent: AlignRule.Start,
    regions: {
        panel1: {
            column: 'first / last',
            row: '1 / span 1',
        },
        panel2: {
            column: 'first / last',
            row: '3 / span 1',
        },
    }
};

const layout: {
    [index: string]: RectangledObject;
} = calculate(
    this.game.world.bounds, layoutConfig, defaultAreaConstructor
);
```
