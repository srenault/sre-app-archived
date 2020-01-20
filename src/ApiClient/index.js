import { Base64 } from 'js-base64';
import FinanceClient from './FinanceClient';
import ReleasesClient from './ReleasesClient';

function request(basicAuth) {
  return (url, options = {}) => {
    const { user, password } = basicAuth;

    const defaultOptions = (() => {
      if (user && password) {
        const headers = new Headers();
        const basicAuthValue = Base64.encode(`${user}:${password}`);

        headers.append('Authorization', `Basic ${basicAuthValue}`);
        return {
          credentials: 'include',
          headers,
        };
      } else {
        return {};
      }
    })();

    return fetch(url, { ...defaultOptions, ...options });
  };
}

export default class ApiClient {
  constructor({ endpoint, basicAuth }) {
    if (!endpoint) throw new Error('Please specify endpoint');

    const defaultOptions = {
      request: request(basicAuth),
    };

    this.finance = new FinanceClient({
      endpoint: `${endpoint}/finance`,
      ...defaultOptions,
    });

    this.releases = new ReleasesClient({
      endpoint: `${endpoint}/releases`,
      ...defaultOptions,
    });
  }
}
