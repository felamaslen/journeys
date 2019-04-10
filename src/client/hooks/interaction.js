import { useMemo, useEffect } from 'react';

export function useInteraction(makeInteraction, map, memoParameters = []) {
  const interaction = useMemo(makeInteraction, memoParameters);

  useEffect(() => {
    if (map && interaction) {
      map.addInteraction(interaction);
    }
  }, [map, interaction]);
}
