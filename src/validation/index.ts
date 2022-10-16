import { InputType } from "../types";
import { depthValidator } from "./depth.validator";
import { fo2Validator } from "./fo2.validator";
import { ppo2maxValidator } from "./ppo2max.validator";

export type InputValidator = (value: any) => void | Error;

const inputValidators: { [type in keyof typeof InputType]: InputValidator } = {
  PPO2MAX: ppo2maxValidator,
  DEPTH: depthValidator,
  FO2: fo2Validator
};

export const validateInput = (value: any, type: InputType) => {
  const validator = inputValidators[type];
  if (typeof validator !== 'function') {
    throw new Error('Unknown input validation type');
  }

  return validator(value);
};
