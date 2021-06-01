import moment from 'moment';

export interface IStep {
  workflow: string
  start: number
  end: number | null
  success: boolean | null
  error: Error | null
}

export interface IContext {
  workflows: Array<string>
  curr: IStep | null
  steps: Record<string, IStep>
  success: boolean | null
}

const next = (context: IContext, curr: string): string | null => {
  const index = context.workflows.indexOf(curr);
  if (index + 1 >= context.workflows.length) {
    return null;
  }
  return context.workflows[index + 1];
};

export class Workflow {
  operator: Record<string, (context: IContext) => void | string> = {}
  workflows: Array<string> = []
  constructor(operator: Record<string, (context: IContext) => void | string> | Array<(context: IContext) => void | string>) {
    if (operator instanceof Array) {
      operator.forEach((item, index) => {
        const key = `${index}`;
        this.operator[key] = item;
        this.workflows.push(key);
      });
    } else {
      this.operator = operator;
      this.workflows = Object.keys(operator);
    }
    if (!this.workflows.length) {
      throw new Error('Invalid operator');
    }
  }

  async dispatch(context: IContext, curr: string): Promise<void> {
    const operator: Record<string, (context: IContext) => void | string> = this.operator;
    context.curr = {
      workflow: curr,
      start: moment().valueOf(),
      end: null,
      success: null,
      error: null
    };
    let res: string | null | unknown = null;
    try {
      res = await operator[curr].call(this, context);
      context.curr.success = true;
    } catch (e) {
      context.curr.success = false;
      context.curr.error = e;
    }
    context.curr.end = moment().valueOf();
    context.steps[curr] = context.curr;
    if (!context.curr.success) {
      throw context.curr.error;
    } else if (typeof res === 'string' && context.workflows.indexOf(res) > -1) {
      await this.dispatch(context, res);
    } else {
      const result = next(context, curr);
      if (result) {
        await this.dispatch(context, result);
      }
    }
  }

  async start(context: IContext): Promise<IContext> {
    return new Promise((resolve, reject) => {
      if (!context) {
        throw new Error('Invalid context');
      }
      context.success = null;
      context.curr = null;
      context.steps = {};
      this.dispatch(context, context.workflows[0]).then(() => {
        context.curr = null;
        context.success = true;
        resolve(context);
      }).catch((e) => {
        context.success = false;
        if (context.curr) {
          context.curr.error = e;
          context.curr.end = moment().valueOf();
          context.steps[context.curr.workflow] = context.curr;
        }
        reject(context);
      });
    });
  }
}
