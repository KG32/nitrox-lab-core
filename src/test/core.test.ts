import { assert } from 'chai';

import nx from '../index';

describe('Core', () => {
    it('Should get units', () => {
        const units = nx.units;
        assert.isObject(units);
        assert.property(units, 'pressure');
    });
});

describe('Calculations', () => {

    it('Should calculate MOD', () => {
        // tuple [pO2, MOD]
        const modCasesDefault: [number, number][] = [
            [0.32, 33.75],
            [0.36, 28.89]
        ];
        modCasesDefault.forEach(modCase => {
            const [caseEan, caseMOD] = modCase;
            const result = nx.calcMOD(caseEan);
            assert.strictEqual(result, caseMOD);
        });
    });

    it('Should throw on incorrect depth range', () => {
        const eanValues = [0, -32, -321, -0];
        eanValues.forEach(ean => {
            assert.throws(() => nx.calcMOD(ean), 'Incorrect depth range');
        });
    });

    it('Should throw on incorrect ppO2Max range', () => {
        const ppO2MaxValues = [0, 0.3, 0.453, -3, -0, -0.12];
        ppO2MaxValues.forEach(ppO2Max => {
            assert.throws(() => nx.calcMOD(32, ppO2Max), 'Incorrect ppO2Max');
        });
    });
});
