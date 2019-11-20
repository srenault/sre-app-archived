import React from 'react';
import Loading from './Loading';
import Error from './Error';

export default function PureAsync({ asyncState, children }) {

  if (asyncState.isLoading) {

    return <Loading />;

  } else if (asyncState.error) {

    return <Error />;

  } else {

    return <>{children}</>;

  }
}
