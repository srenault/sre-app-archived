import accounts from './dump/finance/accounts';
import account from './dump/finance/account';

import { delay } from './common';

export default {
  fetchAccountsOverview() {
    return delay(accounts);
  },

  fetchAccount(accountId) {
    return delay(account);
  },
};
