import {
  Configuration,
} from '@axiosleo/cli-tool';

const config = new Configuration({
  db: {
    // mysql: {
    //   type: 'mysql',
    //   user: 'root',
    //   password: 'root',
    //   port: 3306,
    //   host: 'localhost',
    //   database: 'ts_study',
    // },
  }
});
export default config;
