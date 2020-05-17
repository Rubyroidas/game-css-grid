import {isValidSize, produceValue, smartProduceValue} from './Utils';

describe('isValidSize', () => {
    test('50 is not valid', () => {
        const parsed = isValidSize('50');
        expect(parsed).not.toBe(true);
    });
    test('100px is valid', () => {
        const parsed = isValidSize('100px');
        expect(parsed).toBe(true);
    });
    test('100.5px is valid', () => {
        const parsed = isValidSize('100.5px');
        expect(parsed).toBe(true);
    });
    test('-100px is valid', () => {
        const parsed = isValidSize('-100px');
        expect(parsed).toBe(true);
    });
    test('-100.5px is valid', () => {
        const parsed = isValidSize('-100.5px');
        expect(parsed).toBe(true);
    });
    test('-0.5px is valid', () => {
        const parsed = isValidSize('-0.5px');
        expect(parsed).toBe(true);
    });
    test('100% is valid', () => {
        const parsed = isValidSize('100%');
        expect(parsed).toBe(true);
    });
    test('100.5% is valid', () => {
        const parsed = isValidSize('100.5%');
        expect(parsed).toBe(true);
    });
    test('-100% is valid', () => {
        const parsed = isValidSize('-100%');
        expect(parsed).toBe(true);
    });
    test('-100.5% is valid', () => {
        const parsed = isValidSize('-100.5%');
        expect(parsed).toBe(true);
    });
    test('-0.5% is valid', () => {
        const parsed = isValidSize('-0.5%');
        expect(parsed).toBe(true);
    });
    test('% is not valid', () => {
        const parsed = isValidSize('%');
        expect(parsed).not.toBe(true);
    });
    test('2fr is valid', () => {
        const parsed = isValidSize('2fr');
        expect(parsed).toBe(true);
    });
    test('1.5fr is valid', () => {
        const parsed = isValidSize('1.5fr');
        expect(parsed).toBe(true);
    });
    test('-2fr is not valid', () => {
        const parsed = isValidSize('-2fr');
        expect(parsed).not.toBe(true);
    });
    test('-fr is not valid', () => {
        const parsed = isValidSize('-fr');
        expect(parsed).not.toBe(true);
    });
    test('fr is valid', () => {
        const parsed = isValidSize('fr');
        expect(parsed).toBe(true);
    });
    test('2h is valid', () => {
        const parsed = isValidSize('2h');
        expect(parsed).toBe(true);
    });
    test('1.5h is valid', () => {
        const parsed = isValidSize('1.5h');
        expect(parsed).toBe(true);
    });
    test('-2h is not valid', () => {
        const parsed = isValidSize('-2h');
        expect(parsed).not.toBe(true);
    });
    test('-h is not valid', () => {
        const parsed = isValidSize('-h');
        expect(parsed).not.toBe(true);
    });
    test('h is valid', () => {
        const parsed = isValidSize('h');
        expect(parsed).toBe(true);
    });
    test('2w is valid', () => {
        const parsed = isValidSize('2w');
        expect(parsed).toBe(true);
    });
    test('1.5w is valid', () => {
        const parsed = isValidSize('1.5w');
        expect(parsed).toBe(true);
    });
    test('-2w is not valid', () => {
        const parsed = isValidSize('-2w');
        expect(parsed).not.toBe(true);
    });
    test('-w is not valid', () => {
        const parsed = isValidSize('-w');
        expect(parsed).not.toBe(true);
    });
    test('w is valid', () => {
        const parsed = isValidSize('w');
        expect(parsed).toBe(true);
    });
    test('vw is valid', () => {
        const parsed = isValidSize('vw');
        expect(parsed).toBe(true);
    });
    test('vh is valid', () => {
        const parsed = isValidSize('vh');
        expect(parsed).toBe(true);
    });
});
describe('produceValue', () => {
    test('100,50 is not calculated', () => {
        const parsed = produceValue(100, '50');
        expect(parsed).toBeNull();
        expect(parsed).not.toBe(50);
    });
    test('100,50.5px is calculated as 50.5', () => {
        const parsed = produceValue(100, '50.5px');
        expect(parsed).toBe(50.5);
    });
    test('100,0.5px is calculated as 0.5', () => {
        const parsed = produceValue(100, '0.5px');
        expect(parsed).toBe(0.5);
    });
    test('100,-50px is calculated as -50', () => {
        const parsed = produceValue(100, '-50px');
        expect(parsed).toBe(-50);
    });
    test('100,-50.5px is calculated as -50.5', () => {
        const parsed = produceValue(100, '-50.5px');
        expect(parsed).toBe(-50.5);
    });
    test('100,-0.5px is calculated as -0.5', () => {
        const parsed = produceValue(100, '-0.5px');
        expect(parsed).toBe(-0.5);
    });
    test('100,50px is calculated as 50', () => {
        const parsed = produceValue(100, '50px');
        expect(parsed).toBe(50);
    });
    test('200,50% is calculated as 100', () => {
        const parsed = produceValue(200, '50%');
        expect(parsed).toBe(100);
    });
    test('200,50.5% is calculated as 101', () => {
        const parsed = produceValue(200, '50.5%');
        expect(parsed).toBe(101);
    });
    test('200,0.5% is calculated as 1', () => {
        const parsed = produceValue(200, '0.5%');
        expect(parsed).toBe(1);
    });
    test('200,-50% is calculated as -100', () => {
        const parsed = produceValue(200, '-50%');
        expect(parsed).toBe(-100);
    });
    test('200,-50.5% is calculated as -101', () => {
        const parsed = produceValue(200, '-50.5%');
        expect(parsed).toBe(-101);
    });
    test('200,-0.5% is calculated as -1', () => {
        const parsed = produceValue(200, '-0.5%');
        expect(parsed).toBe(-1);
    });
    test('400,100% is calculated as 400', () => {
        const parsed = produceValue(400, '100%');
        expect(parsed).toBe(400);
    });
    test('100,40% is calculated as 40', () => {
        const parsed = produceValue(100, '40%');
        expect(parsed).toBe(40);
    });
    test('100,2fr is returned as 2fr', () => {
        const parsed = produceValue(100, '2fr');
        expect(parsed).toEqual([2, 'fr']);
    });
    test('200,fr is returned as fr', () => {
        const parsed = produceValue(200, 'fr');
        expect(parsed).toEqual([1, 'fr']);
    });
    test('100,2h is returned as 2h', () => {
        const parsed = produceValue(100, '2h');
        expect(parsed).toEqual([2, 'h']);
    });
    test('100,1.5h is returned as 1.5h', () => {
        const parsed = produceValue(100, '1.5h');
        expect(parsed).toEqual([1.5, 'h']);
    });
    test('200,h is returned as h', () => {
        const parsed = produceValue(200, 'h');
        expect(parsed).toEqual([1, 'h']);
    });
    test('100,2w is returned as 2w', () => {
        const parsed = produceValue(100, '2w');
        expect(parsed).toEqual([2, 'w']);
    });
    test('100,1.5w is returned as 1.5w', () => {
        const parsed = produceValue(100, '1.5w');
        expect(parsed).toEqual([1.5, 'w']);
    });
    test('200,w is returned as w', () => {
        const parsed = produceValue(200, 'w');
        expect(parsed).toEqual([1, 'w']);
    });
    test('200,10vw is returned as 10vw', () => {
        const parsed = produceValue(200, '10vw');
        expect(parsed).toEqual([10, 'vw']);
    });
    test('200,-10vw is returned as -10vw', () => {
        const parsed = produceValue(200, '-10vw');
        expect(parsed).toEqual([-10, 'vw']);
    });
});
describe('smartProduceValue', () => {
    const baseValue = 200;
    const customUnits = { vw: 2, vh: 4, vmin: 2, vmax: 4 };
    test('10vw is equal 20', () => {
        const parsed = smartProduceValue('10vw', baseValue, customUnits);
        expect(parsed).toEqual(20);
    });
    test('-10vw is equal -20', () => {
        const parsed = smartProduceValue('-10vw', baseValue, customUnits);
        expect(parsed).toEqual(-20);
    });
    test('10 is invalid', () => {
        const parsed = smartProduceValue('10', baseValue, customUnits);
        expect(parsed).toBeNull();
    });
    test('-10 is invalid', () => {
        const parsed = smartProduceValue('-10', baseValue, customUnits);
        expect(parsed).toBeNull();
    });
});
