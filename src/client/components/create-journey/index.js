import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useApi } from '~/client/hooks/api';
import LoadingSpinner from '~/client/components/loading-spinner';
import CurrentTimeButton from '~/client/components/current-time-button';

export default function CreateJourney({ routeId, onCreate }) {
  const [postDepartureRequest, error, loading] = useApi({
    method: 'post',
    url: 'journeys/departure',
    onSuccess: onCreate,
  });

  const startJourney = useCallback(time => {
    postDepartureRequest({
      routeId,
      departure: time.toISO(),
    });
  }, [postDepartureRequest, routeId]);

  return <>
    {loading && <LoadingSpinner />}
    {!loading && (
      <CurrentTimeButton
        error={error}
        onClick={startJourney}
        className="create-journey"
      >{'Start'}</CurrentTimeButton>
    )}
  </>;
}

CreateJourney.propTypes = {
  routeId: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
};
