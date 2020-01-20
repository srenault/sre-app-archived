export class UnknownTransaction extends Error {
  constructor(transactionId) {
    super(`Unknown transaction ${transactionId}`);
    this.transactionId = transactionId;
  }
}

export class CancelledTransaction extends Error {
  constructor(transactionId) {
    super(`Transaction ${transactionId} has been cancelled`);
    this.transactionId = transactionId;
  }
}

export default class FinanceClient {
  constructor({ endpoint, request }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
    this.request = request;
  }

  async fetchAccountsOverview() {
    const response = await this.request({
      url: `${this.endpoint}/accounts`,
    });
    return response.json();
  }

  async fetchAccount(accountId, periodDate) {
    const params = periodDate ? `?periodDate=${periodDate}` : '';
    const response = await this.request(`${this.endpoint}/accounts/${accountId}${params}`);
    return response.json();
  }

  async fetchAnalytics() {
    const response = await this.request(`${this.endpoint}/analytics`);
    return response.json();
  }

  async fetchAnalyticsPeriod(periodDate) {
    const response = await this.request(`${this.endpoint}/analytics/period/${periodDate}`);
    return response.json();
  }

  startPollingOtpStatus(transactionId, onPending) {
    let id;
    let cancelPromise;
    let cancel = () => {};

    const p = new Promise((resolve, reject) => {
      cancelPromise = reject;

      id = window.setInterval(async () => {
        try {
          const otpRequest = await this.request(`${this.endpoint}/otp/${transactionId}/status`).then((response) => response.json());
          if (otpRequest.status === 'pending') {
            if (onPending) onPending(otpRequest);
          } else if (otpRequest.status === 'validated') {
            window.clearInterval(id);
            resolve(otpRequest);
          } else if (otpRequest.status === 'unknown') {
            window.clearInterval(id);
            reject(new UnknownTransaction(transactionId));
          }
        } catch (e) {
          window.clearInterval(id);
          reject(e);
        }
      }, 2000);
    });

    cancel = () => {
      if (id) window.clearInterval(id);
      if (cancelPromise) cancelPromise(new CancelledTransaction(transactionId));
    };

    return [cancel, p];
  }
}
