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

    get units() {
        return {
            pressure: this.unitsPressure
        }
    }
}

export default new NitroxLabCore();
