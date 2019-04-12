import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

import { EMPTY_LINE } from '~/client/constants/route';
import { useFetchRoute } from '~/client/hooks/route';
import LoadingSpinner from '~/client/components/loading-spinner';
import RouteEditor from '~/client/components/route-editor';
import StatusBar from '~/client/components/status-bar';

import './style.scss';

function ViewRoute({ match }) {
  const { params: { id } } = match;
  const [route, loading, error] = useFetchRoute(match);

  return (
    <div className="view-route">
      {loading && <LoadingSpinner />}
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
          <Link
            className="link-edit"
            to={`/routes/${id}/edit`}
          >{'Edit'}</Link>
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
