import React, { useState } from 'react';

import RouteSelector from '~/client/components/route-selector';

import './style.scss';

export default function Landing() {
  const [route, setRoute] = useState(null);

  return (
    <div className="landing-page">
      {!route && <RouteSelector onSelect={setRoute} />}
      {route && <span>{'Route: '}{route}</span>}
    </div>
  );
}
