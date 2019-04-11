import React, { useState } from 'react';

import { EMPTY_LINE } from '~/client/constants/route';
import RouteEditor from '~/client/components/route-editor';

import './style.scss';

export default function NewRoute() {
  const [route, setRoute] = useState(EMPTY_LINE);

  return (
    <div className="new-route">
      <h3 className="subtitle">{'Add a new route'}</h3>
      <table>
        <tbody>
          <tr>
            <th>{'route'}</th>
            <td>{JSON.stringify(route.points)}</td>
          </tr>
          <tr>
            <th>{'length'}</th>
            <td>{(route.length / 1000).toFixed(2)}{' km'}</td>
          </tr>
          <tr>
            <th>{'bearing'}</th>
            <td>{route.bearing}&deg;</td>
          </tr>
        </tbody>
      </table>
      <RouteEditor
        onChange={setRoute}
      />
    </div>
  );
}
