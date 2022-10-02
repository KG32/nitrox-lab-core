export enum UNITS_PRESSURE {
    BAR = 'BAR',
    PSI = 'PSI'
};

export enum UNITS_DEPTH {
    M = 'M',
    FT = 'FT'
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

    convMetersToFeet(meters: number): number {
        return meters * 3.281;
    }

    roundNum(num: number, digits: number): number {
        return Math.floor( num * Math.pow(10, digits) ) / Math.pow(10, digits);
    }

    calcMOD(pO2: number, ppO2Max: number): number {
        if (!(pO2 > 0)) {
            throw new Error('Incorrect depth range');
        }

        if (ppO2Max !== undefined && !(ppO2Max >= 1)) {
            throw new Error('Incorrect ppO2Max');
        }

        let mod = ((ppO2Max * 10) / pO2) - 10;
        if (this.unitsDepth === UNITS_DEPTH.FT) {
            mod = this.convMetersToFeet(mod);
        }
        return this.roundNum(mod, 2);
    }

    calcBestMix(depth: number, ppO2Max: number): number {
        const bestMix = ppO2Max / ((depth / 10) + 1);

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
