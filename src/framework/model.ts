import Validator, {
  Rules,
  ErrorMessages,
} from 'validatorjs';
import { HttpError } from './';

/**
 * validator documentation
 * @link https://github.com/mikeerickson/validatorjs
 */
export abstract class Model {
  constructor(obj?: { [key: string]: any }, rules?: Rules, msg?: ErrorMessages) {
    if(obj){
      Object.assign(this, obj);
    }
    if(rules){
      const validation = this.validate(rules, msg);
      if (validation.fails()) {
        const errors = validation.errors.all();
        const keys = Object.keys(errors);
        throw new HttpError(400, errors[keys[0]][0]);
      }
    }
  }

  static create<T extends Model>(
    c: new (obj?: { [key: string]: any }) => T,
    obj?: { [key: string]: any }
  ): T {
    return new c(obj);
  }

  toJson(): string {
    return JSON.stringify(this);
  }

  properties(): Array<string> {
    return Object.keys(this);
  }

  count(): number {
    return this.properties().length;
  }

  validate(rules: Rules, msg?: ErrorMessages): Validator.Validator<this> {
    const validation = new Validator(this, rules, msg);
    validation.check();
    return validation;
  }
}

export default Model;
