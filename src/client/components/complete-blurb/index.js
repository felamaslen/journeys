import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import humanizeDuration from 'humanize-duration';

import './style.scss';

export default function CompleteBlurb({ journey, onDismiss }) {
  const {
    origin,
    destination,
    departure,
    arrival,
    length,
  } = journey;

  const departureDate = DateTime.fromISO(departure);
  const arrivalDate = DateTime.fromISO(arrival);

  const lengthKm = `${(length / 1000).toFixed(1)} km`;

  const timeTakenMs = arrivalDate - departureDate;
  const timeTaken = humanizeDuration(timeTakenMs, {
    round: true,
    units: ['h', 'm'],
  });

  // length is in meters, time in milliseconds
  // m -> km and ms -> s cancels out the scaling by 1000 on each side,
  // while the 3600 factors in s -> h
  const speedKmh = length / timeTakenMs * 3600;

  const speed = `${speedKmh.toFixed(1)} km/h`;

  return (
    <div className="journey-complete-blurb">
      <h2>{'You arrived at '}{destination}!</h2>
      <p>
        <span>{'This journey from '}</span>
        <span className="origin">{origin}</span>
        <span>{' of '}</span>
        <span className="length">{lengthKm}</span>
        <span>{' took you '}</span>
        <span className="time">{timeTaken}{','}</span>
        <span>{' meaning you travelled at an average speed of '}</span>
        <span className="speed">{speed}</span>
        <span>{'.'}</span>
      </p>
      <button className="button-dismiss" onClick={onDismiss}>
        {'Start another journey'}
      </button>
    </div>
  );
}

CompleteBlurb.propTypes = {
  journey: PropTypes.shape({
    origin: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    departure: PropTypes.string.isRequired,
    arrival: PropTypes.string.isRequired,
  }),
  onDismiss: PropTypes.func.isRequired,
};
