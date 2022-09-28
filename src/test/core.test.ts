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
        // tuple [pO2, ppO2Max, MOD]
        const modCasesMetric: [number, number, number][] = [
            [0.32, 1.4, 33.75],
            [0.36, 1.4, 28.89]
        ];
        modCasesMetric.forEach(modCase => {
            const [caseEan, casePpO2Max, caseMOD] = modCase;
            const result = nx.calcMOD(caseEan, casePpO2Max);
            assert.strictEqual(result, caseMOD);
        });
    });

    it('Should calculate MOD imperial', () => {
        const modCasesImperial: [number, number, number][] = [
            [0.32, 1.4, 110.73],
            [0.36, 1.4, 94.79]
        ];
        modCasesImperial.forEach(modCase => {
            const [caseEan, casePpO2Max, caseMOD] = modCase;
            const result = nx.calcMOD(caseEan, casePpO2Max, { unitsDepth: UNITS_DEPTH.FT });
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
