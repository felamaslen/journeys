import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import axios from 'axios';

import { EMPTY_LINE } from '~/client/constants/route';
import RouteEditor from '~/client/components/route-editor';

import './style.scss';

const initRequest = async (source, data, setError, onSuccess) => {
  try {
    const res = await axios.post('/api/v1/routes', data, {
      cancelToken: source.token,
    });

    setError(null);
    onSuccess(res.data.id);
  } catch (err) {
    if (!axios.isCancel(err)) {
      setError(err.response.data.err);
    }
  }
};

function NewRoute({ history }) {
  const [route, setRoute] = useState(EMPTY_LINE);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState(null);

  const [source, setSource] = useState(null);

  const validate = useCallback(() => ({
    origin: !origin.length,
    destination: !destination.length,
    route: !route.points.length,
  }), [origin, destination, route.points]);

  const onSuccess = useCallback(id => history.push(`/routes/${id}`), [history]);

  const onSubmit = useCallback(() => {
    const currentErrors = validate();

    setErrors(currentErrors);

    if (Object.keys(currentErrors).some(key => currentErrors[key])) {
      return;
    }

    if (source) {
      source.cancel('New request made');
    }

    const newSource = axios.CancelToken.source();
    setSource(newSource);

    const data = {
      origin,
      destination,
      ...route,
    };

    initRequest(newSource, data, setRequestError, onSuccess);
  }, [
    source,
    validate,
    origin,
    destination,
    route,
    onSuccess,
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
      <div className={classNames('status', { error: requestError })}>
        {requestError}
      </div>
    </div>
  );
}

NewRoute.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(NewRoute);
