import { useState, useMemo, useEffect } from 'react';

export function useInteraction(makeInteraction, map, memoParameters = []) {
  const interaction = useMemo(makeInteraction, memoParameters);
  const [prevInteraction, setPrevInteraction] = useState(null);

  useEffect(() => {
    if (map) {
      if (prevInteraction) {
        map.removeInteraction(prevInteraction);
      }
      if (interaction) {
        map.addInteraction(interaction);
      }
    }

    if (prevInteraction !== interaction) {
      setPrevInteraction(interaction);
    }
  }, [map, interaction, prevInteraction]);
}
