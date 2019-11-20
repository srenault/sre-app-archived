import React, { useCallback } from 'react';
import { useAsync } from 'react-async';
import PureAsync from './PureAsync';

export default function withAsyncComponent(asyncFetch) {
  return (Component) => (props) => {
    const promiseFn = useCallback(() => asyncFetch(props), []);
    const asyncState = useAsync({ promiseFn });

    return (
        <PureAsync asyncState={asyncState}>
          <Component {...props} asyncState={asyncState} />;
        </PureAsync>
    ); // eslint-disable-line react/jsx-props-no-spreading
  };
}
