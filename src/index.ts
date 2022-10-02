export enum UNITS_PRESSURE {
    BAR = 'bar',
    PSI = 'psi'
};

export enum UNITS_DEPTH {
    M = 'm',
    FT = 'ft'
}

interface CoreOptions {
    unitsPressure?: UNITS_PRESSURE;
    unitsDepth?: UNITS_DEPTH;
    defaultPpO2Max?: number;
}

class NitroxLabCore {
    unitsPressure: UNITS_PRESSURE;
    unitsDepth: UNITS_DEPTH;
    defaultPpO2Max: number;

    constructor(options?: CoreOptions) {
        const { unitsPressure, unitsDepth, defaultPpO2Max } = options || {};
        this.unitsPressure = unitsPressure ? unitsPressure : UNITS_PRESSURE.BAR;
        this.unitsDepth = unitsDepth ? unitsDepth : UNITS_DEPTH.M;
        this.defaultPpO2Max = defaultPpO2Max ? defaultPpO2Max : 1.4;
    }

    convDepth(depth: number, target: UNITS_DEPTH): number {
        const factor = 3.281;
        if (target === UNITS_DEPTH.FT) {
            return depth * factor;
        } else {
            return depth / factor;
        }
    }

    roundNum(num: number, digits: number): number {
        return Math.floor( num * Math.pow(10, digits) ) / Math.pow(10, digits);
    }

    calcMOD(pO2: number, ppO2Max: number): number {
        if (!(pO2 > 0)) {
            throw new Error('Incorrect depth range');
        }
        if (!(ppO2Max > 1)) {
            throw new Error('Incorrect ppO2Max');
        }
        let mod = ((ppO2Max * 10) / pO2) - 10;
        if (this.unitsDepth === UNITS_DEPTH.FT) {
            mod = this.convDepth(mod, UNITS_DEPTH.FT);
        }
        return this.roundNum(mod, 2);
    }

    calcBestMix(depth: number, ppO2Max: number): number {
        let d = depth;
        if (this.unitsDepth === UNITS_DEPTH.FT) {
            d = this.convDepth(d, UNITS_DEPTH.M);
        }
        const bestMix = ppO2Max / ((d / 10) + 1);
        return this.roundNum(bestMix, 2);
    }

    get units() {
        return {
            pressure: this.unitsPressure,
            depth: this.unitsDepth
        }
    }
}

export { NitroxLabCore };
