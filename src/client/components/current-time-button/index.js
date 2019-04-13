import React, { useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

export default function CurrentTimeButton({
  error,
  className,
  onClick,
  children,
}) {
  const [errorState, setErrorState] = useState(false);

  useEffect(() => {
    setErrorState(Boolean(error));
  }, [error]);

  const getCurrentTime = useCallback(() => DateTime.local(), []);
  const [time, setTime] = useState(getCurrentTime());
  const timer = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(timer.current);
    setTime(getCurrentTime());

    timer.current = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);
  }, [getCurrentTime]);

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  useEffect(() => () => {
    clearInterval(timer.current);
  }, []);

  const onFocus = useCallback(() => {
    clearInterval(timer.current);
  }, []);

  const onChange = useCallback(evt => {
    setTime(DateTime.fromJSDate(new Date(evt.target.value)));
  }, []);

  const handleClick = useCallback(() => {
    onClick(time);
  }, [onClick, time]);

  const dismissError = useCallback(() => {
    setErrorState(null);
    startTimer();
  }, [startTimer]);

  return (
    <div className={className}>
      {errorState && (
        <div className={`${className}-error`}>
          <p>
            {'An error occurred: '}{error}
          </p>
          <button onClick={dismissError}>{'Try again'}</button>
        </div>
      )}
      {!errorState && <>
        <input
          className={`${className}-time`}
          type="datetime-local"
          onFocus={onFocus}
          onChange={onChange}
          value={time.toFormat('yyyy-LL-dd\'T\'HH:mm:ss')}
          step="1"
        />
        <button
          className={`${className}-button`}
          onClick={handleClick}
        >{children}</button>
      </>}
    </div>
  );
}

CurrentTimeButton.propTypes = {
  error: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
