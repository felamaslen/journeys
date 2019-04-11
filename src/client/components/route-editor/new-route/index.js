import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { EMPTY_LINE } from '~/client/constants/route';
import { useApi } from '~/client/hooks/api';
import RouteEditor from '~/client/components/route-editor';
import StatusBar from '~/client/components/status-bar';

import './style.scss';

function NewRoute({ history }) {
  const [route, setRoute] = useState(EMPTY_LINE);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const [errors, setErrors] = useState({});

  const validate = useCallback(() => ({
    origin: !origin.length,
    destination: !destination.length,
    route: !route.points.length,
  }), [origin, destination, route.points]);

  const onSuccess = useCallback(({ id }) => history.push(`/routes/${id}`), [history]);

  const data = useMemo(() => ({
    origin,
    destination,
    ...route,
  }), [
    origin,
    destination,
    route,
  ]);

  const [postRequest, requestError] = useApi({
    method: 'post',
    url: 'routes',
    data,
    onSuccess,
  });

  const onSubmit = useCallback(() => {
    const currentErrors = validate();

    setErrors(currentErrors);
    if (Object.keys(currentErrors).some(key => currentErrors[key])) {
      return;
    }

    postRequest();
  }, [
    validate,
    postRequest,
  ]);

  return (
    <div className="new-route">
      <h3 className="subtitle">{'Add a new route'}</h3>
      <div className="add-form">
        <div className="form-row">
          <span className="label">{'Origin:'}</span>
          <input
            className={classNames('input', 'input-text', { error: errors.origin })}
            value={origin}
            onChange={evt => setOrigin(evt.target.value)}
          />
        </div>
        <div className="form-row">
          <span className="label">{'Destination:'}</span>
          <input
            className={classNames('input', 'input-text', { error: errors.destination })}
            value={destination}
            onChange={evt => setDestination(evt.target.value)}
          />
        </div>
        <div className="form-row">
          <div className={classNames('route-editor-container', { error: errors.route })}>
            <RouteEditor onChange={setRoute} />
          </div>
        </div>
        <div className="form-row form-row-submit">
          <button
            className="button button-submit"
            onClick={onSubmit}
          >{'Save'}</button>
        </div>
      </div>
      <StatusBar error={requestError} />
    </div>
  );
}

NewRoute.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(NewRoute);
