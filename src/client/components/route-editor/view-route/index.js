import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { EMPTY_LINE } from '~/client/constants/route';
import { useApi } from '~/client/hooks/api';
import RouteEditor from '~/client/components/route-editor';
import StatusBar from '~/client/components/status-bar';

import './style.scss';

function ViewRoute({ match }) {
  const { params: { id } } = match;
  const [route, setRoute] = useState(null);

  const onSuccess = useCallback(data => setRoute(data), [setRoute]);

  const [fetchRoute, error, loading] = useApi({
    url: `routes/${id}`,
    onSuccess,
  });

  useEffect(fetchRoute, [id]);

  return (
    <div className="view-route">
      {loading && (
        <div className="loading-spinner">{'Loading...'}</div>
      )}
      {route && (
        <div className="route-info">
          <table>
            <tbody>
              <tr>
                <th>{'Origin:'}</th>
                <td>{route.origin}</td>
              </tr>
              <tr>
                <th>{'Destination:'}</th>
                <td>{route.destination}</td>
              </tr>
              <tr>
                <th>{'Length:'}</th>
                <td>{(route.length / 1000).toFixed(2)}{' km'}</td>
              </tr>
              <tr>
                <th>{'Weighted bearing:'}</th>
                <td>{route.bearing.toFixed(1)}&deg;</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <RouteEditor
        initialLine={route || EMPTY_LINE}
      />
      <StatusBar error={error} />
    </div>
  );
}

ViewRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default withRouter(ViewRoute);
