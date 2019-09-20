import PropTypes from 'prop-types';

export const StatementPropTypes = PropTypes.shape({
  id: PropTypes.string,
  date: PropTypes.string,
  amount: PropTypes.number,
  label: PropTypes.string,
  balance: PropTypes.balance,
});

export default {
  StatementPropTypes,
};
