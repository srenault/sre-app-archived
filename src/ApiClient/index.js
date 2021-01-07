import { Base64 } from 'js-base64';
import Cookies from 'js-cookie';
import FinanceClient from './FinanceClient';
import ReleasesClient from './ReleasesClient';
import EnergyClient from './EnergyClient';
import HeatersClient from './HeatersClient';

function generateBasicAuthToken(user, password) {
  return Base64.encode(`${user}:${password}`);
}

function request(basicAuthToken) {
  return (url, options = {}) => {
    const defaultOptions = (() => {
      if (basicAuthToken) {
        const headers = new Headers();
        headers.append('Authorization', `Basic ${basicAuthToken}`);
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

    const { user, password } = basicAuth || {};
    const basicAuthToken = (user && password) && generateBasicAuthToken(user, password);

    if (basicAuthToken) {
      Cookies.set('token', basicAuthToken);
    }

    const defaultOptions = {
      request: request(basicAuthToken),
      basicAuthToken,
    };

    this.energy = new EnergyClient({
      endpoint: `${endpoint}/energy`,
      ...defaultOptions,
    });

    this.heaters = new HeatersClient({
      endpoint: `${endpoint}/heaters`,
      ...defaultOptions,
    });

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
