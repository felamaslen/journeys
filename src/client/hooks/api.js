import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';

const makeRequest = async (source, options, onError, onSuccess, onComplete) => {
  let success = true;
  let res = null;

  try {
    res = await axios({
      ...options,
      cancelToken: source.token,
    });

    onError(null);
  } catch (err) {
    success = false;
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

  if (success) {
    onSuccess(res.data);
  }
};

export function useApi({
  method = 'get',
  url,
  onSuccess,
}) {
  const source = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onError = useCallback((statusCode, err) => setError(err), [setError]);

  const onComplete = useCallback(() => setLoading(false), [setLoading]);

  useEffect(() => () => {
    if (source.current) {
      source.current.cancel('Component unmounted');
    }
  }, []);

  const request = useCallback(data => {
    if (!url) {
      return;
    }
    if (source.current) {
      source.current.cancel('New request made');
    }

    source.current = axios.CancelToken.source();

    const options = {
      method,
      url: `/api/v1/${url}`,
      data,
    };

    setLoading(true);
    makeRequest(source.current, options, onError, onSuccess, onComplete);
  }, [
    method,
    url,
    onSuccess,
    onError,
    onComplete,
  ]);

  return [request, error, loading];
}
