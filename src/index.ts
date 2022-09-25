enum UNITS_PRESSURE {
    BAR = 'BAR',
    PSI = 'PSI'
};

class NitroxLabCore {
    unitsPressure: UNITS_PRESSURE;
    ppO2Max: number;

    constructor() {
        this.unitsPressure = UNITS_PRESSURE.BAR;
        this.ppO2Max = 1.4;
    }

    calcMOD(pO2: number, customPPO2Max?: number): number {
        if (!(pO2 > 0)) {
            throw new Error('Incorrect depth range');
        }
        if (customPPO2Max !== undefined && !(customPPO2Max >= 1)) {
            throw new Error('Incorrect ppO2Max');
        }

        const ppO2Max = customPPO2Max !== undefined ? customPPO2Max : this.ppO2Max;

        const mod = (((ppO2Max * 10) / pO2) - 10).toFixed(2);
        return Number(mod);
    }

    get units() {
        return {
            pressure: this.unitsPressure
        }
    }
}

export default new NitroxLabCore();
