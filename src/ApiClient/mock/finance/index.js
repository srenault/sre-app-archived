import balances from './balances';
import statements from './statements';
import categorizedExpenses from './categorized_expenses';
import balancesHistory from './balances_history';

import { delay } from '../common';

export default {
  fetchBalances() {
    return delay(balances);
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
