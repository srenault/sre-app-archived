import PropTypes from 'prop-types';

export const StatementPropTypes = PropTypes.shape({
  date: PropTypes.string,
  amount: PropTypes.number,
  label: PropTypes.string,
  balance: PropTypes.balance,
});

export default {
  StatementPropTypes,
};
