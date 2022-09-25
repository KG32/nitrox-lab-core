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
    it.skip('Should calculate MOD', () => {
        // tuple [EAN, MOD]
        const modCases: [number, number][] = [
            [32, 33.8],
            [36, 28.9]
        ];

        modCases.forEach(modCase => {
            const [caseEan, caseMod] = modCase;

        });
    });
});
