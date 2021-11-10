import Model from '../framework/model';

export class TestModel extends Model {
  test?: string;
  abc?: number;
  email?: string;
  constructor(obj?: { [key: string]: any }) {
    super(obj, {
      test: 'required',
      abc: 'required|integer|min:18',
      email: 'required|email'
    });
  }
}
