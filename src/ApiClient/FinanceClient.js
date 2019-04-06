export default class FinanceClient {

  constructor({ endpoint }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
  }

  async fetchAccountsOverview() {
    const response = await fetch(`${this.endpoint}/accounts`);
    return await response.json();
  }

  async fetchStatements(accountId) {
    const response = await fetch(`${this.endpoint}/accounts/${accountId}/statements`);
    return await response.json();
  }

  async fetchCategorizedExpenses(accountId) {
    const response = await fetch(`${this.endpoint}/accounts/${accountId}/expenses`);
    return await response.json();
  }

  async fetchHistoryBalances(day, nbMonths) {
    const response = fetch(`${this.endpoint}/accounts/history/balances`);
    return await response.json();
  }
}
