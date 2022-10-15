export enum Units {
    METRIC = 'metric',
    IMPERIAL = 'imperial'
}

interface TopOffOptions {
    currentMix: { fO2: number, p: number };
    topOffMix: { fO2: number };
    targetPressure: number;
}

interface CoreOptions {
    units?: Units;
    defaultPpO2Max?: number;
}

class NitroxLabCore {
    units: Units;
    defaultPpO2Max: number;

    constructor(options?: CoreOptions) {
        const { units, defaultPpO2Max } = options || {};
        this.units = units ? units : Units.METRIC;
        this.defaultPpO2Max = defaultPpO2Max ? defaultPpO2Max : 1.4;
    }

    convDepth(depth: number, target: Units): number {
        const factor = 3.281;
        if (target === Units.IMPERIAL) {
            return depth * factor;
        } else {
            return depth / factor;
        }
    }

    numFixed(num: number, digits: number, mode: 'floor' | 'ceil'): number {
        const pwr = Math.pow(10, digits);
        return Math[mode](num * pwr) / pwr;
    }

    calcMOD(fO2: number, ppO2Max: number): number {
        if (!(fO2 > 0)) {
            throw new Error('Incorrect fO2 range');
        }
        if (!(ppO2Max > 1)) {
            throw new Error('Incorrect ppO2Max');
        }
        let mod = ((ppO2Max * 10) / fO2) - 10;
        if (this.units === Units.IMPERIAL) {
            mod = this.convDepth(mod, Units.IMPERIAL);
        }
        return this.numFixed(mod, 2, 'floor');
    }

    calcBestMix(depth: number, ppO2Max: number): number {
        let d = depth;
        if (this.units === Units.IMPERIAL) {
            d = this.convDepth(d, Units.METRIC);
        }
        const bestMix = ppO2Max / ((d / 10) + 1);
        return this.numFixed(bestMix, 2, 'floor');
    }

    calcTopOff(mixes: TopOffOptions): number {
        const { currentMix, topOffMix, targetPressure } = mixes;
        const currentO2P = currentMix.fO2 * currentMix.p;
        const topOffO2P = topOffMix.fO2 * (targetPressure - currentMix.p);
        const endO2P = currentO2P + topOffO2P;
        const endFO2 = endO2P / targetPressure;

        return this.numFixed(endFO2, 3, 'ceil');
    }
}

export { NitroxLabCore };
