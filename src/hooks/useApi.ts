import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';

type UseApiOptions = {
  autoFetch?: boolean;
};
type Data<T> = T | null;
type CustomError = Error | null;

interface UseApiResult<T> {
  loading: boolean;
  data: Data<T>;
  error: CustomError;
  fetch: () => void;
}

const useApi = <T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  options?: UseApiOptions
): UseApiResult<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Data<T>>(null);
  const [error, setError] = useState<CustomError>(null);

  const fetch = useCallback(() => {
    const call = apiCall();
    setLoading(true);
    call
      .then((response) => {
        setData(response.data);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiCall]);

  useEffect(() => {
    if (options && options.autoFetch) {
      // cleanup fetch
      return fetch();
    }
  }, [fetch, options]);

  return { loading, data, error, fetch };
};

export default useApi;
