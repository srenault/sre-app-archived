import accounts from './dump/finance/accounts';
import account from './dump/finance/account';
import analytics from './dump/finance/analytics';

import { delay } from './common';

export default {
  fetchAccountsOverview() {
    return delay(accounts);
  },

  fetchAccount(/* accountId */) {
    return delay(account);
  },

  fetchAnalytics() {
    return delay(analytics);
  }
};
