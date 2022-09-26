export enum UNITS_PRESSURE {
    BAR = 'BAR',
    PSI = 'PSI'
};

export enum UNITS_DEPTH {
    M = 'M',
    FT = 'FT'
}

interface CalcModOptions {
    ppO2Max?: number;
    unitsDepth?: UNITS_DEPTH;
}

class NitroxLabCore {
    unitsPressure: UNITS_PRESSURE;
    unitsDepth: UNITS_DEPTH;
    defaultppO2Max: number;

    constructor() {
        this.unitsPressure = UNITS_PRESSURE.BAR;
        this.unitsDepth = UNITS_DEPTH.M;
        this.defaultppO2Max = 1.4;
    }

    convMetersToFeet(meters: number): number {
        return meters * 3.281;
    }

    calcMOD(pO2: number, options?: CalcModOptions): number {
        if (!(pO2 > 0)) {
            throw new Error('Incorrect depth range');
        }

        const { ppO2Max = this.defaultppO2Max, unitsDepth = this.unitsDepth } = options || {};
        if (ppO2Max !== undefined && !(ppO2Max >= 1)) {
            throw new Error('Incorrect ppO2Max');
        }

        let mod = Number((((ppO2Max * 10) / pO2) - 10).toFixed(2));
        if (unitsDepth === UNITS_DEPTH.FT) {
            mod = Number(this.convMetersToFeet(mod).toFixed(2));
        }
        return mod;
    }

    get units() {
        return {
            pressure: this.unitsPressure,
            depth: this.unitsDepth
        }
    }
}

export default new NitroxLabCore();
