import FinanceClient from './FinanceClient';

export default class ApiClient {
  constructor({ endpoint }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.finance = new FinanceClient({ endpoint: `${endpoint}/finance` });
  }
}
