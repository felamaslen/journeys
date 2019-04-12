import { useState, useCallback, useEffect } from 'react';
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

  const request = useCallback((requestData = data) => {
    if (source) {
      source.cancel('New request made');
    }

    const newSource = axios.CancelToken.source();
    setSource(newSource);

    const options = {
      method,
      url: `/api/v1/${url}`,
      data: requestData,
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
