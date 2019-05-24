import PropTypes from 'prop-types';

export const AsyncStatePropTypes = PropTypes.shape({
  data: PropTypes.any.isRequired,
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  reload: PropTypes.func.isRequired,
});

export const AsyncStateDefaultProps = {
  error: null,
};

export default {
  AsyncStatePropTypes,
  AsyncStateDefaultProps,
};
