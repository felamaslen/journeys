import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { useRedirectToRoute } from '~/client/hooks/route';
import { useApi } from '~/client/hooks/api';
import RouteEditForm from '~/client/components/route-edit-form';

import './style.scss';

function NewRoute({ history }) {
  const onSuccess = useRedirectToRoute(history);

  const [onSaveRequest, requestError] = useApi({
    method: 'post',
    url: 'routes',
    onSuccess,
  });

  return (
    <div className="new-route">
      <h3 className="subtitle">{'Add a new route'}</h3>
      <RouteEditForm
        className="add-form"
        onSaveRequest={onSaveRequest}
        requestError={requestError}
      />
    </div>
  );
}

NewRoute.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(NewRoute);
