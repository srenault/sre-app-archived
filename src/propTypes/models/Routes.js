import PropTypes from 'prop-types';

export const RoutesPropTypes = (() => {
  const RoutePropTypes = PropTypes.shape({
    key: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    exact: PropTypes.bool.isRequired,
    component: PropTypes.shape({
      header: PropTypes.func.isRequired,
      main: PropTypes.func.isRequired,
    }),
  });

  RoutePropTypes.children = PropTypes.arrayOf(PropTypes.shape(RoutePropTypes)).isRequired;

  return PropTypes.arrayOf(RoutePropTypes);
})();

export const RoutePathsPropTypes = (() => {
  const RoutePathPropTypes = PropTypes.shape({
    exact: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    reversePath: PropTypes.func.isRequired,
  });

  RoutePathPropTypes.children = PropTypes.arrayOf(PropTypes.shape(RoutePathPropTypes)).isRequired;

  return PropTypes.objectOf(RoutePathPropTypes);
})();

export const RouteNavItemsPropTypes = (() => {
  const RouteNavItemObjTypes = PropTypes.shape({
    path: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    Icon: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
  });

  const RouteNavItemArrTypes = PropTypes.arrayOf(RouteNavItemObjTypes);

  return PropTypes.arrayOf(PropTypes.oneOfType([RouteNavItemObjTypes, RouteNavItemArrTypes]));
})();

export default {
  RoutesPropTypes,
  RoutePathsPropTypes,
  RouteNavItemsPropTypes,
};
