import React from 'react';
import PropTypes from 'prop-types';

import Header from 'App/Header';

export default function ElectricityHeader({ refresh }) {
  return (
    <Header refresh={refresh}>Electricité</Header>
  );
}

ElectricityHeader.propTypes = {
  refresh: PropTypes.bool,
};

ElectricityHeader.defaultProps = {
  refresh: false,
};
