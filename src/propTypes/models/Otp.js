import PropTypes from 'prop-types';

const OtpStatusPropTypes = PropTypes.oneOf(['init', 'pending', 'validated', 'unknown', 'error']);

export const OtpStatePropTypes = PropTypes.shape({
  status: OtpStatusPropTypes.isRequired,
  transactionId: PropTypes.string,
  apkId: PropTypes.string,
});

OtpStatePropTypes.defaultProps = {
  transactionId: null,
  apkId: null,
};

export default {
  OtpStatePropTypes,
};
