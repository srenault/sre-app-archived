import accounts from './dump/finance/accounts';
import statements from './dump/finance/statements';
import categorizedExpenses from './dump/finance/categorized_expenses';
import balancesHistory from './dump/finance/balances_history';

import { delay } from './common';

export default {
  fetchAccountsOverview() {
    return delay(accounts);
  },

  fetchStatements(accountId) {
    return delay(statements);
  },

  fetchCategorizedExpenses() {
    return delay(categorizedExpenses);
  },

  fetchHistoryBalances() {
    return delay(balancesHistory);
  }
};
