import { config, RouteItem, addRoute, getRouteInfo } from '../src/framework';
import { helper } from '@axiosleo/cli-tool';
import * as path from 'path';
const fs = helper.fs;
import { expect } from 'chai';

describe('Routes test cases', () => {
  let routesConfig: RouteItem[] = [];
  let routesResult: any;
  before(() => {
    routesConfig = [
      {
        path: '/',
        method: 'get|post',
        handler: 'index/index/index',
        intro: '',
      },
      {
        path: '/test/{:id}/{:title}/foo/{:bar}', // with params
        method: 'any',                             // match all request method
        handler: 'index/index/index',
        intro: 'has param',
      },
      {
        path: '/has/**/text/{:name}',           // ** : ingore string before next '/'
        method: 'post',
        handler: 'index/index/index',
        intro: 'ignore part of path',
      },
      {
        path: '/admin/***', // *** : ignore string
        method: 'any',
        handler: 'index/index/illegal',
        intro: 'default route rule',
      },
      {
        path: '/***', // *** : ignore string
        method: 'any',
        handler: 'index/index/notFound',
        intro: 'the default route rule when none of the above rules are matched',
      }
    ];
  });

  it('shoud be ok to resolve Routes Configuration', async () => {
    config.routes = {};
    routesConfig.forEach(r => addRoute(r));
    routesResult = config.routes;
    const expected = await fs._read(path.join(__dirname, './assets/routes.resolve.result.json'));
    expect(expected).to.be.equal(JSON.stringify(routesResult));
  });

  it('should be ok to get Route Info', async () => {
    config.routes = {};
    routesConfig.forEach(r => addRoute(r));
    let route = getRouteInfo('/test/1/a/foo/bar', 'GET');
    expect(route).to.be.exist;
    expect(route?.method).to.be.equal('GET');
    expect(route?.pattern).to.be.equal('/test/{:id}/{:title}/foo/{:bar}');
    expect(JSON.stringify(route?.params)).to.be.equal(JSON.stringify({ id: '1', title: 'a', bar: 'bar' }));

    route = getRouteInfo('/has/not/exist', 'POST');
    expect(route).to.be.null;
  });
});
