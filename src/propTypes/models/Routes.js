import PropTypes from 'prop-types';

export const RoutesPropTypes = PropTypes.array;

export const RoutePaths = (() => {
  const RoutePropTypes = PropTypes.shape({
    exact: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    reversePath: PropTypes.func.isRequired,
  });

  RoutePropTypes.children = PropTypes.arrayOf(PropTypes.shape(x)).isRequired;

  PropTypes.objectOf(RoutePropTypes);
});

export const RouteNavItems = PropTypes.array;
