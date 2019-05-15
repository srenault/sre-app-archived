import React, { useCallback } from 'react';
import { useAsync } from 'react-async';
import Loading from './Loading';
import Error from './Error';

export default function withAsyncComponent(asyncFetch) {
  return Component => (props) => {
    const promiseFn = useCallback(() => asyncFetch(props), []);
    const asyncState = useAsync({ promiseFn });
    if (asyncState.isLoading) {
      return <Loading />;
    } else if (asyncState.error) {
      return <Error />;
    } else {
      return <Component {...props} asyncState={asyncState} />;
    }
  };
}
