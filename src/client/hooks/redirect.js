import { useCallback } from 'react';

export function useRedirect(history, getUrl) {
  return useCallback((...args) => history.push(getUrl(...args)), [history, getUrl]);
}
