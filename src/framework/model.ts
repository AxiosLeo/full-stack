import Validator, {
  Rules,
  Errors,
  ErrorMessages,
} from 'validatorjs';

export abstract class Model {
  constructor(obj?: { [key: string]: any }) {
    if(obj){
      Object.assign(this, obj);
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

  validate(rules: Rules, msg?: ErrorMessages): null | Errors {
    if (rules && Object.keys(rules).length) {
      const v = new Validator(this, rules, msg);
      if (!v.check()) {
        return v.errors;
      }
    }
    return null;
  }
}

export default Model;
