import { useState, useCallback, useEffect } from 'react';

import { useRedirect } from '~/client/hooks/redirect';
import { useApi } from '~/client/hooks/api';

export const useRedirectToRoute = (history, idOverride = null) => useRedirect(
  history, ({ id }) => `/routes/${idOverride || id}`
);

export function useFetchRoute(match) {
  const { params: { id } } = match;
  const [route, setRoute] = useState(null);

  const onSuccess = useCallback(data => setRoute(data), [setRoute]);

  const [fetchRoute, error, loading] = useApi({
    url: `routes/${id}`,
    onSuccess,
  });

  useEffect(fetchRoute, [id]);

  return [route, loading, error];
}
