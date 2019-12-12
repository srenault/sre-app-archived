import React, { useCallback, useEffect, useState } from 'react';
import { useAsync } from 'react-async';
import PureAsync from 'components/AsyncComponent/PureAsync';
import { UnknownTransaction, CancelledTransaction } from 'ApiClient/FinanceClient';
import OtpPending from './OtpPending';
import OtpStatus from './OtpStatus';

export default function withOtpValidation(asyncFetch) {
  return (Component) => (props) => {
    const { apiClient } = props;

    const [otpState, setOtpState] = useState({
      status: OtpStatus.INIT,
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
        return asyncFetch(props).then((result) => {
          if (result.otpRequired) {
            setOtpState({
              status: OtpStatus.PENDING,
              transactionId: result.otpRequired.transactionId,
              apkId: result.otpRequired.apkId,
            });
            return null;
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
        p.then(() => updateOtpStatus(OtpStatus.VALIDATED))
          .catch((error) => {
            if (error instanceof UnknownTransaction) {
              updateOtpStatus(OtpStatus.UNKNOWN);
            } else if (!(error instanceof CancelledTransaction)) {
              updateOtpStatus(OtpStatus.ERROR);
            }
          });
        return () => cancel();
      } else {
        return () => {};
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

    if (!asyncState.data && !asyncState.isLoading && otpState.status != OtpStatus.INIT) {
      return <OtpPending otpState={otpState} onRetryClick={onRetryClick} />;
    } else {
      /* eslint-disable react/jsx-props-no-spreading */
      return (
        <PureAsync asyncState={asyncState}>
          <Component {...props} asyncState={asyncState} />;
        </PureAsync>
      );
      /* eslint-enable react/jsx-props-no-spreading */
    }
  };
}
