import React, { useState, useCallback } from 'react';

import { usePersistentValue } from '~/client/hooks/persist';
import RouteSelector from '~/client/components/route-selector';
import CreateJourney from '~/client/components/create-journey';
import FinishJourney from '~/client/components/finish-journey';
import CompleteBlurb from '~/client/components/complete-blurb';

import './style.scss';

export default function Landing() {
  const [routeId, setRouteId, clearRouteId] = usePersistentValue('routeId');
  const [journeyId, setJourneyId, clearJourneyId] = usePersistentValue('journeyId', [routeId]);

  const onCreate = useCallback(({ journeyId: newJourneyId }) => {
    setJourneyId(newJourneyId);
  }, [setJourneyId]);

  const [finishedJourney, setFinishedJourney] = useState(null);
  const onFinish = useCallback(journey => {
    setFinishedJourney(journey);

    clearJourneyId();
    clearRouteId();
  }, [clearRouteId, clearJourneyId]);

  const onReturn = useCallback(() => {
    setFinishedJourney(null);
  }, []);

  if (finishedJourney) {
    return (
      <CompleteBlurb journey={finishedJourney} onDismiss={onReturn} />
    );
  }

  return (
    <div className="landing-page">
      {!routeId && !journeyId && <RouteSelector onSelect={setRouteId} />}
      {routeId && <>
        {!journeyId && <CreateJourney routeId={routeId} onCreate={onCreate} />}
        {journeyId && <FinishJourney journeyId={journeyId} onFinish={onFinish} />}
      </>}
    </div>
  );
}
