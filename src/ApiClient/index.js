import FinanceClient from './FinanceClient';
import ReleasesClient from './ReleasesClient';

export default class ApiClient {
  constructor({ endpoint }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.finance = new FinanceClient({ endpoint: `${endpoint}/finance` });
    this.releases = new ReleasesClient({ endpoint: `${endpoint}/releases` });
  }
}
