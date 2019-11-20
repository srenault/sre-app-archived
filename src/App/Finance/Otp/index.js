import React, { useCallback, useEffect, useState } from 'react';
import { useAsync } from 'react-async';
import withAsyncComponent from '../../../components/AsyncComponent';
import PureAsync from '../../../components/AsyncComponent/PureAsync';
import OtpPending from './OtpPending';
import OtpStatus from './OtpStatus';

export default function withOtpValidation(asyncFetch) {
  return (Component) => (props) => {

    const { apiClient } = props;

    const [otpState, setOtpState] = useState({
      status: OtpStatus.ERROR,
      apkId: null,
      transactionId: null,
    });

    const updateOtpStatus = (status) => {
      setOtpState({
        status,
        transactionId: otpState.transactionId,
        apkId: otpState.apkId,
      });
    };

    const promiseFn = useCallback(() => {
      if (otpState.status === OtpStatus.INIT || otpState.status === OtpStatus.VALIDATED) {
        return asyncFetch({ apiClient }).then((result) => {
          if (result.otpRequired) {
            setOtpState({
              status: OtpStatus.PENDING,
              transactionId: result.otpRequired.transactionId,
              apkId: result.otpRequired.apkId,
            });
          } else {
            return result;
          }
        });
      } else {
        return Promise.resolve();
      }
    }, [otpState]);

    useEffect(() => {
      if (otpState.status === OtpStatus.PENDING) {
        const [cancel, p] = apiClient.finance.startPollingOtpStatus(otpState.transactionId);
        p.then((otpResult) => {
          updateOtpStatus(OtpStatus.VALIDATED);
        }).catch((error) => {
          if (error.type === 'unknown_transaction') {
            updateOtpStatus(OtpStatus.UNKNOWN);
          } else if (error.type === 'unexpected_error') {
            updateOtpStatus(OtpStatus.ERROR);
          }
        });

        return () => cancel();
      }
    }, [otpState]);

    const onRetryClick = useCallback(() => {
      setOtpState({
        status: OtpStatus.INIT,
        transactionId: null,
        apkId: null,
      });
    });

    const asyncState = useAsync({ promiseFn, watch: otpState });

    if (!asyncState.data && !asyncState.isLoading) {
      return <OtpPending otpState={otpState} onRetryClick={onRetryClick} />;
    } else {
      return (
        <PureAsync asyncState={asyncState}>
          <Component {...props} asyncState={asyncState} />;
        </PureAsync>
      ); // eslint-disable-line react/jsx-props-no-spreading
    }
  };
}
