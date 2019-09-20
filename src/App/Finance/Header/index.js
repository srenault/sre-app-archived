import React from 'react';
import PropTypes from 'prop-types';

import Header from '../../Header';

export default function FinanceHeader({ refresh }) {
  return (
    <Header refresh={refresh}>Finance</Header>
  );
}

FinanceHeader.propTypes = {
  refresh: PropTypes.bool,
};

FinanceHeader.defaultProps = {
  refresh: false,
};
