import PropTypes from 'prop-types';

const VersionPropTypes = PropTypes.shape({
  sha1: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
});

export const ReleasePropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  versions: PropTypes.arrayOf(VersionPropTypes).isRequired,
});

export default {
  ReleasePropTypes,
};
