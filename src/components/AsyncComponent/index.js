import React, { useCallback } from 'react';
import { useAsync } from 'react-async';
import PureAsync from './PureAsync';

export default function withAsyncComponent(asyncFetch) {
  return (Component) => (props) => {
    const promiseFn = useCallback(() => asyncFetch(props), [props]);
    const asyncState = useAsync({ ...props, promiseFn, watch: props });
    /* eslint-disable react/jsx-props-no-spreading */
    return (
      <PureAsync asyncState={asyncState}>
        <Component {...props} asyncState={asyncState} />
      </PureAsync>
    );
    /* eslint-enable react/jsx-props-no-spreading */
  };
}
