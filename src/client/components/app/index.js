import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Landing from '~/client/components/routes/landing';
import CycleRoutes from '~/client/components/routes/cycle-routes';

import './style.scss';

export default function App() {
  return (
    <div className="journeys-app">
      <h1 className="title">{'Journeys'}</h1>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/routes" component={CycleRoutes} />
      </Switch>
    </div>
  );
}
