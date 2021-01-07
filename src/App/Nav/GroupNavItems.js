import React, { Fragment } from 'react';
import SingleNavItem from './SingleNavItem';

export default function GroupNavItems({ items, onClick }) {
  return items.map(({
    label, key, path, Icon,
  }) => (
    <Fragment key={key}>
      <SingleNavItem label={label} Icon={Icon} path={path} onClick={onClick} />
    </Fragment>
  ));
}
