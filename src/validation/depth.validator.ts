import { InputValidator } from ".";

export const depthValidator: InputValidator = (value: any) => {
  if (!(typeof value === 'number' && value > 0)) {
    throw new Error('Incorrect depth');
  }
};
