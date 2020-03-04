const env = '<@env@>';

export default {
  prod: env === 'prod',
  dev: env === 'dev',
  mock: env === 'mock',
  endpoint: '<@endpoint@>',
  basicAuth: {
    user: '<@basic_auth_user@>',
    password: '<@basic_auth_password@>',
  },
};
