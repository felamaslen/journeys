import React from 'react';

import RouteEditor from '~/client/components/route-editor';

import './style.scss';

export default function NewRoute() {
  return (
    <div className="new-route">
      <h3 className="subtitle">{'Add a new route'}</h3>
      <RouteEditor />
    </div>
  );
}
