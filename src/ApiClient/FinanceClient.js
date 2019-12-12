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
  constructor({ endpoint }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
  }

  async fetchAccountsOverview() {
    const response = await fetch(`${this.endpoint}/accounts`);
    return response.json();
  }

  async fetchAccount(accountId, periodDate) {
    const params = periodDate ? `?periodDate=${periodDate}` : '';
    const response = await fetch(`${this.endpoint}/accounts/${accountId}${params}`);
    return response.json();
  }

  async fetchAnalytics() {
    const response = await fetch(`${this.endpoint}/analytics`);
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
          const otpRequest = await fetch(`${this.endpoint}/otp/${transactionId}/status`).then((response) => response.json());
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
