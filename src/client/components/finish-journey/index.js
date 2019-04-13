import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useApi } from '~/client/hooks/api';
import LoadingSpinner from '~/client/components/loading-spinner';
import CurrentTimeButton from '~/client/components/current-time-button';

export default function FinishJourney({ journeyId, onFinish }) {
  const [postArrivalRequest, error, loading] = useApi({
    method: 'post',
    url: `journeys/${journeyId}/arrival`,
    onSuccess: onFinish,
  });

  const finishJourney = useCallback(time => {
    postArrivalRequest({
      arrival: time.toISO(),
    });
  }, [postArrivalRequest]);

  return <>
    {loading && <LoadingSpinner />}
    {!loading && (
      <CurrentTimeButton
        error={error}
        onClick={finishJourney}
        className="finish-journey"
      >{'Finish'}</CurrentTimeButton>
    )}
  </>;
}

FinishJourney.propTypes = {
  journeyId: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
};
