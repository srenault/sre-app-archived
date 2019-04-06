import { useEffect } from 'react';
import { useAsync } from "react-async";

export function useAsyncPolling({ promiseFn, delay }) {
  const state = useAsync({ promiseFn });

  useEffect(() => {
    const i = setInterval(() => state.reload(), delay);
    return () => clearInterval(i);
  });

  return state;
}

export default {
  useAsyncPolling,
};
