export default class FinanceClient {

  constructor({ endpoint }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
  }

  async fetchBalances() {
    const response = await fetch(`${this.endpoint}/balances`);
    return await response.json();
  }

  async fetchStatements(accountId) {
    const response = await fetch(`${this.endpoint}/statements/${accountId}`);
    return await response.json();
  }

  async fetchCategorizedExpenses(accountId) {
    const response = await fetch(`${this.endpoint}/expenses/${accountId}`);
    return await response.json();
  }

  async fetchHistoryBalances(day, nbMonths) {
    const response = fetch(`${this.endpoint}/history/balances`);
    return await response.json();
  }
}
