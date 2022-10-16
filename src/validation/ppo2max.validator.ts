import { InputValidator } from ".";

export const ppo2maxValidator: InputValidator = (value: any) => {
  if (!(typeof value === 'number' && value > 0)) {
    throw new Error('Incorrect ppO2Max');
  }
};
