import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { useRedirectToRoute, useFetchRoute } from '~/client/hooks/route';
import { useApi } from '~/client/hooks/api';
import { generatePatch } from '~/client/modules/patch';
import LoadingSpinner from '~/client/components/loading-spinner';
import RouteEditForm from '~/client/components/route-edit-form';

import './style.scss';

const patchSpec = [
  'origin',
  'destination',
  {
    key: 'points',
    type: 'array',
  },
];

function EditRoute({ history, match }) {
  const { params: { id } } = match;
  const [route, loading, errorLoadingRoute] = useFetchRoute(match);

  const onSuccess = useRedirectToRoute(history, id);

  const [onPatch, requestError] = useApi({
    method: 'patch',
    url: `routes/${id}`,
    onSuccess,
  });

  const onSaveRequest = useCallback(data => {
    if (loading || !route) {
      return null;
    }

    const patch = generatePatch(patchSpec, route, data);
    if (!patch.length) {
      return onSuccess({ id });
    }

    return onPatch(patch);
  }, [id, loading, route, onPatch, onSuccess]);

  return (
    <div className="edit-route">
      <h3 className="subtitle">{'Edit route'}</h3>
      {loading && <LoadingSpinner />}
      {route && <RouteEditForm
        className="add-form"
        values={route}
        onSaveRequest={onSaveRequest}
        requestError={requestError || errorLoadingRoute}
      />}
    </div>
  );
}

EditRoute.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default withRouter(EditRoute);
