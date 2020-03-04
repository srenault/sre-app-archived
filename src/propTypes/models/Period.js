import PropTypes from 'prop-types';

export const PeriodPropTypes = PropTypes.shape({
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  yearMonth: PropTypes.string,
  balance: PropTypes.number,
});

export default {
  PeriodPropTypes,
};
