import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useApi } from '~/client/hooks/api';
import LoadingSpinner from '~/client/components/loading-spinner';
import StatusBar from '~/client/components/status-bar';

import './style.scss';

export default function RouteSelector({ onSelect }) {
  const [origins, setOrigins] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState('');

  const [getOrigins, errorOrigins, loadingOrigins] = useApi({
    url: 'origin',
    onSuccess: setOrigins,
  });

  const [routes, setRoutes] = useState([]);
  const [getRoutes, errorRoutes, loadingRoutes] = useApi({
    url: selectedOrigin && `origin/${selectedOrigin}/routes`,
    onSuccess: setRoutes,
  });

  useEffect(() => {
    getOrigins();
  }, [getOrigins]);

  useEffect(() => {
    if (selectedOrigin) {
      getRoutes();
    }
  }, [selectedOrigin, getRoutes]);

  const onSelectOrigin = useCallback(evt => setSelectedOrigin(evt.target.value), []);

  const onResetOrigin = useCallback(() => setSelectedOrigin(''), []);

  const onSelectRoute = useCallback(evt => onSelect(evt.target.value), [onSelect]);

  return (
    <div className="route-selector">
      {(loadingOrigins || loadingRoutes) && <LoadingSpinner />}
      {!selectedOrigin && origins.length && (
        <div className="origin-selector">
          <span className="label">{'Origin:'}</span>
          <select
            className="origin-selector-select"
            value={selectedOrigin}
            onChange={onSelectOrigin}
            disabled={loadingOrigins}
          >
            <option value="" />
            {origins.map(origin => (
              <option key={origin} value={origin}>{origin}</option>
            ))}
          </select>
        </div>
      )}
      {selectedOrigin && !loadingOrigins && routes.length && (
        <div className="route-selector">
          <button className="button-back" onClick={onResetOrigin}>{'Back'}</button>
          <span className="label">{'Destination:'}</span>
          <select
            className="route-selector-select"
            defaultValue=""
            onChange={onSelectRoute}
            disabled={loadingRoutes}
          >
            <option value={null} />
            {routes.map(({ id, destination }) => (
              <option key={id} value={id}>{destination}</option>
            ))}
          </select>
        </div>
      )}
      <StatusBar error={errorOrigins || errorRoutes} />
    </div>
  );
}

RouteSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
