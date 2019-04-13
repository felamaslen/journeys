import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ListRoutes from '~/client/components/list-routes';
import NewRoute from '~/client/components/route-editor/new-route';
import ViewRoute from '~/client/components/route-editor/view-route';
import EditRoute from '~/client/components/route-editor/edit-route';

import './style.scss';

export default function CycleRoutes() {
  return (
    <div className="cycle-routes">
      <h2 className="page-title">{'Cycle route editor'}</h2>
      <Switch>
        <Route exact path="/routes" component={ListRoutes} />
        <Route path="/routes/new" component={NewRoute} />
        <Route path="/routes/:id/edit" component={EditRoute} />
        <Route path="/routes/:id" component={ViewRoute} />
      </Switch>
    </div>
  );
}
