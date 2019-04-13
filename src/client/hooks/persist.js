import { useState, useCallback } from 'react';

import { getValue, setValue, removeValue } from '~/client/modules/store';

export function usePersistentValue(key, requiredValues = []) {
  let initialValue = null;
  if (!requiredValues.some(value => value === null)) {
    initialValue = getValue(key);
  }

  const [localValue, setLocalValue] = useState(initialValue);

  const onSetValue = useCallback(newValue => {
    setValue(key, newValue);
    setLocalValue(newValue);
  }, [key]);

  const onRemoveValue = useCallback(() => {
    removeValue(key);
    setLocalValue(null);
  }, [key]);

  return [localValue, onSetValue, onRemoveValue];
}
