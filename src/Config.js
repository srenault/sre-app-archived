const env = '<@env@>';

export default {
  prod: env === 'prod',
  dev: env === 'dev',
  mock: env === 'mock',
  endpoint: '<@endpoint@>',
};
