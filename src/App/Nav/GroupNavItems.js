import React, { Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import SingleNavItem from './SingleNavItem';

export default function GroupNavItems({ items, onClick }) {
  return items.map(({
    label, key, path, Icon,
  }, index) => (
    <Fragment key={key}>
      { index === 0 && <Divider /> }
      <SingleNavItem label={label} Icon={Icon} path={path} onClick={onClick} />
      { (index === items.length - 1) && <Divider /> }
    </Fragment>
  ));
}
