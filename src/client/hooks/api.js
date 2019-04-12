import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const makeRequest = async (source, options, onError, onSuccess, onComplete) => {
  try {
    const res = await axios({
      ...options,
      cancelToken: source.token,
    });

    onError(null);
    onSuccess(res.data);
  } catch (err) {
    if (!axios.isCancel(err)) {
      try {
        const { err: responseErr } = err.response.data;

        onError(err.statusCode, responseErr);
      } finally {
        onError(err.statusCode, err.message);
      }
    }
  } finally {
    onComplete();
  }
};

export function useApi({
  method = 'get',
  url,
  data,
  onSuccess,
}) {
  const [source, setSource] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onError = useCallback((statusCode, err) => setError(err), [setError]);

  const onComplete = useCallback(() => setLoading(false), [setLoading]);

  useEffect(() => () => {
    if (source) {
      source.cancel('Component unmounted');
    }
  }, [source]);

  const request = useCallback(() => {
    if (source) {
      source.cancel('New request made');
    }

    const newSource = axios.CancelToken.source();
    setSource(newSource);

    const options = {
      method,
      url: `/api/v1/${url}`,
      data,
    };

    setLoading(true);
    makeRequest(newSource, options, onError, onSuccess, onComplete);
  }, [
    source,
    method,
    url,
    data,
    onSuccess,
    onError,
    onComplete,
  ]);

  return [request, error, loading];
}
