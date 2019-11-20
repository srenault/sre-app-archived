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

  startPollingOtpStatus(transactionId, onPending) {
    let id;
    let cancelPromise;

    const p = new Promise((resolve, reject) => {
      cancelPromise = reject;

      id = window.setInterval(async () => {
        try {
          const response = await fetch(`${this.endpoint}/otp/${transactionId}/status`).then(response => response.json());
          if (response.status === 'pending') {
            onPending && onPending(response);
          } else if (response.status === 'validated') {
            window.clearInterval(id);
            resolve(response);
          } else if (response.status === 'unknown') {
            cancel();
            window.clearInterval(id);
            reject({ type: 'unknown_transaction'});
          }
        } catch(e) {
          window.clearInterval(id);
          reject({ type: 'unexpected_error' });
        }
      }, 2000);
    });

    const cancel = () => {
      id && window.clearInterval(id);
      cancelPromise && cancelPromise({ type: 'cancelled' });
    };

    return [cancel, p];
  }
}
