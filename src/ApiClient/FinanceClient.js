export default class FinanceClient {
  constructor({ endpoint }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
  }

  async fetchAccountsOverview() {
    const response = await fetch(`${this.endpoint}/accounts`);
    return response.json();
  }

  async fetchAccount(accountId, startDate) {
    const response = await fetch(`${this.endpoint}/accounts/${accountId}?startDate=${startDate}`);
    return response.json();
  }

  async fetchAnalytics() {
    const response = await fetch(`${this.endpoint}/analytics`);
    return response.json();
  }
}
