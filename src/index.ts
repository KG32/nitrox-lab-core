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

enum InputType {
    DEPTH,
    PPO2MAX,
    FO2
}

class NitroxLabCore {
    units: Units;
    defaultPpO2Max: number;

    constructor(options?: CoreOptions) {
        const { units, defaultPpO2Max } = options || {};
        this.units = units ? units : Units.METRIC;
        this.defaultPpO2Max = defaultPpO2Max ? defaultPpO2Max : 1.4;
    }

    private convDepth(depth: number, target: Units): number {
        const factor = 3.281;
        if (target === Units.IMPERIAL) {
            return depth * factor;
        } else {
            return depth / factor;
        }
    }

    private validateInput(value: any, type: InputType): void | Error {
        switch(type) {
            case InputType.DEPTH:
                if (!(typeof value === 'number' && value > 0)) {
                    throw new Error('Incorrect depth');
                }
                break;
            case InputType.FO2:
                if (!(typeof value === 'number' && value > 0)) {
                    throw new Error('Incorrect fO2');
                }
                break;
            case InputType.PPO2MAX:
                if (!(typeof value === 'number' && value > 0)) {
                    throw new Error('Incorrect ppO2Max');
                }
                break;
            default:
                throw new Error('Unknown input validation type');
        }
    }

    private numFixed(num: number, digits: number, mode: 'floor' | 'ceil'): number {
        const pwr = Math.pow(10, digits);
        return Math[mode](num * pwr) / pwr;
    }

    calcMOD(fO2: number, ppO2Max: number): number {
        this.validateInput(fO2, InputType.FO2);
        this.validateInput(ppO2Max, InputType.PPO2MAX);
        let mod = ((ppO2Max * 10) / fO2) - 10;
        if (this.units === Units.IMPERIAL) {
            mod = this.convDepth(mod, Units.IMPERIAL);
        }
        return this.numFixed(mod, 2, 'floor');
    }

    calcBestMix(depth: number, ppO2Max: number): number {
        this.validateInput(depth, InputType.DEPTH);
        this.validateInput(ppO2Max, InputType.PPO2MAX);
        let d = depth;
        if (this.units === Units.IMPERIAL) {
            d = this.convDepth(d, Units.METRIC);
        }
        let bestMix = ppO2Max / ((d / 10) + 1);
        if (bestMix > 1) {
            bestMix = 1;
        }
        return this.numFixed(bestMix, 2, 'floor');
    }

    calcTopOff(options: TopOffOptions): number {
        const { currentMix, topOffMix, targetPressure } = options;
        const currentO2P = currentMix.fO2 * currentMix.p;
        const topOffO2P = topOffMix.fO2 * (targetPressure - currentMix.p);
        const endO2P = currentO2P + topOffO2P;
        const endFO2 = endO2P / targetPressure;

        return this.numFixed(endFO2, 3, 'ceil');
    }
}

export { NitroxLabCore };
