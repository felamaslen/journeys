import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NewRoute from '~/client/components/route-editor/new-route';

export default function CycleRoutes() {
  return (
    <div className="cycle-routes">
      <h2 className="page-title">{'Cycle route editor'}</h2>
      <Switch>
        <Route path="/routes/new" component={NewRoute} />
      </Switch>
    </div>
  );
}
