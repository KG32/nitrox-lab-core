import { assert } from 'chai';

import nx, { UNITS_DEPTH } from '../index';

describe('Core', () => {
    it('Should get units', () => {
        const units = nx.units;
        assert.isObject(units);
        assert.hasAllKeys(units, ['pressure', 'depth']);
    });
});

describe('Calculations', () => {
    it('Should calculate MOD metric', () => {
        // tuple [pO2, MOD]
        const modCasesMetric: [number, number][] = [
            [0.32, 33.75],
            [0.36, 28.89]
        ];
        modCasesMetric.forEach(modCase => {
            const [caseEan, caseMOD] = modCase;
            const result = nx.calcMOD(caseEan, 1.4);
            assert.strictEqual(result, caseMOD);
        });
    });

    it('Should calculate MOD imperial', () => {
        const modCasesImperial: [number, number][] = [
            [0.32, 110.73],
            [0.36, 94.79]
        ];
        modCasesImperial.forEach(modCase => {
            const [caseEan, caseMOD] = modCase;
            const result = nx.calcMOD(caseEan, 1.4, { unitsDepth: UNITS_DEPTH.FT });
            assert.strictEqual(result, caseMOD);
        });
    });

    it('Should throw on incorrect depth range', () => {
        const eanValues = [0, -32, -321, -0];
        eanValues.forEach(ean => {
            assert.throws(() => nx.calcMOD(ean, 1.4), 'Incorrect depth range');
        });
    });

    it('Should throw on incorrect ppO2Max range', () => {
        const ppO2MaxValues = [0, 0.3, 0.453, -3, -0, -0.12];
        ppO2MaxValues.forEach(ppO2Max => {
            assert.throws(() => nx.calcMOD(32, ppO2Max), 'Incorrect ppO2Max');
        });
    });
});
