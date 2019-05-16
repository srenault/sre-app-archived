import PropTypes from 'prop-types';

export const AsyncStatePropTypes = {
  data: PropTypes.any.isRequired,
  error: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  reload: PropTypes.func.isRequired,
};

export default {
  AsyncStatePropTypes,
};
