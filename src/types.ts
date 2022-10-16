export enum Units {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

export interface TopOffOptions {
  currentMix: { fO2: number, p: number };
  topOffMix: { fO2: number };
  targetPressure: number;
}

export interface CoreOptions {
  units?: Units;
  defaultPpO2Max?: number;
}

export enum InputType {
  DEPTH,
  PPO2MAX,
  FO2
}
