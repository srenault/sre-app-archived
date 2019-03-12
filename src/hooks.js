import { useEffect } from 'react';
import { useAsync } from "react-async";

export function useAsyncPolling(promiseFn, timeout) {
  const state = useAsync({ promiseFn });

  useEffect(() => {
    const i = setInterval(() => state.reload(), timeout);
    return () => clearInterval(i);
  });

  return state;
}

export default {
  useAsyncPolling,
};
