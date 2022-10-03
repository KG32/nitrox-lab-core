import { assert } from 'chai';

import { NitroxLabCore, UNITS_DEPTH} from '../index';

interface TopOffCase {
    currentMix: { fO2: number, p: number };
    topOffMix: { fO2: number };
    targetPressure: number;
    resultFO2: number;
}

describe('Core', () => {
    it('Should get units', () => {
        const nx = new NitroxLabCore();
        const units = nx.units;
        assert.isObject(units);
        assert.hasAllKeys(units, ['pressure', 'depth']);
    });
});

describe('Calculations', () => {

    describe('Maximum operating depth', () => {


        it('Should calculate MOD metric', () => {
            const nx = new NitroxLabCore();

            // tuple [pO2, ppO2Max, MOD]
            const modCasesMetric: [number, number, number][] = [
                [0.32, 1.4, 33.75],
                [0.36, 1.4, 28.88]
            ];
            modCasesMetric.forEach(modCase => {
                const [caseEan, casePpO2Max, caseMOD] = modCase;
                const result = nx.calcMOD(caseEan, casePpO2Max);
                assert.strictEqual(result, caseMOD);
            });
        });

        it('Should calculate MOD imperial', () => {
            const nx = new NitroxLabCore({ unitsDepth: UNITS_DEPTH.FT });

            const modCasesImperial: [number, number, number][] = [
                [0.32, 1.4, 110.73],
                [0.36, 1.4, 94.78]
            ];
            modCasesImperial.forEach(modCase => {
                const [caseEan, casePpO2Max, caseMOD] = modCase;
                const result = nx.calcMOD(caseEan, casePpO2Max);
                assert.strictEqual(result, caseMOD);
            });
        });

        it('Should throw on incorrect depth range', () => {
            const nx = new NitroxLabCore();

            const eanValues = [0, -32, -321, -0];
            eanValues.forEach(ean => {
                assert.throws(() => nx.calcMOD(ean, 1.4), 'Incorrect depth range');
            });
        });

        it('Should throw on incorrect ppO2Max range', () => {
            const nx = new NitroxLabCore();

            const ppO2MaxValues = [0, 0.3, 0.453, -3, -0, -0.12, null, undefined];
            ppO2MaxValues.forEach(ppO2Max => {
                assert.throws(() => nx.calcMOD(32, ppO2Max as number), 'Incorrect ppO2Max');
            });
        });

    });

    describe('Best mix', () => {

        it('Should calculate best mix metric', () => {
            const nx = new NitroxLabCore();

            const bestMixCasesMetric: [number, number, number][] = [
                [33, 1.4, 0.32]
            ];
            bestMixCasesMetric.forEach(bestMixCase => {
                const [caseDepth, casePPO2Max, caseBestMix] = bestMixCase;
                const bestMix = nx.calcBestMix(caseDepth, casePPO2Max);
                assert.strictEqual(bestMix, caseBestMix);
            });
        });

        it('Should calculate best mix imperial', () => {
            const nx = new NitroxLabCore({ unitsDepth: UNITS_DEPTH.FT });
            const bestMixCasesImperial: [number, number, number][] = [
                [110, 1.4, 0.32]
            ];
            bestMixCasesImperial.forEach(bestMixCase => {
                const [caseDepth, casePPO2Max, caseBestMix] = bestMixCase;
                const bestMix = nx.calcBestMix(caseDepth, casePPO2Max);
                assert.strictEqual(bestMix, caseBestMix);
            });
        });
    });

    describe('Gas mixing', () => {
        describe('Top off', () => {
            it('Should calculate top off result BAR', () => {
                const nx = new NitroxLabCore();
                const topOffCases: TopOffCase[] = [
                    {
                        currentMix: { fO2: 0.32, p: 100 },
                        topOffMix: { fO2: 0.21 },
                        targetPressure: 200,
                        resultFO2: 0.265
                    },
                    {
                        currentMix: { fO2: 0.21, p: 50 },
                        topOffMix: { fO2: 0.32 },
                        targetPressure: 210,
                        resultFO2: 0.294
                    }
                ];
                topOffCases.forEach(topOffCase => {
                    const { currentMix, topOffMix, targetPressure, resultFO2 } = topOffCase;
                    const result = nx.calcTopOff({ currentMix, topOffMix, targetPressure });
                    assert.strictEqual(result, resultFO2);
                });
            });
        });
    });
});
