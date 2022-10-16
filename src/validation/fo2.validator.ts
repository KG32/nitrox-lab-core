import { InputValidator } from ".";

export const fo2Validator: InputValidator = (value: any) => {
  if (!(typeof value === 'number' && value > 0)) {
    throw new Error('Incorrect fO2');
  }
};
