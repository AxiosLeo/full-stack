import Validator, {
  Rules,
  Errors,
  ErrorMessages,
} from 'validatorjs';

abstract class Model {
  // eslint-disable-next-line no-undef
  [key: string]: any;
  constructor(obj?: { [key: string]: any }) {
    if(obj){
      Object.keys(obj).forEach(key => {
        this[key] = obj[key];
      });
    }
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
