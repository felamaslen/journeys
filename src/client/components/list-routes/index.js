import React, { useState, useEffect, useCallback } from 'react';

import { useApi } from '~/client/hooks/api';
import LoadingSpinner from '~/client/components/loading-spinner';
import StatusBar from '~/client/components/status-bar';
import ListRoutesItem from '~/client/components/list-routes-item';

import './style.scss';

export default function ListRoutes() {
  const [items, setItems] = useState([]);
  const [fetchItems, error, loading] = useApi({
    url: 'routes',
    onSuccess: setItems,
  });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onDelete = useCallback(id => {
    setItems(items.filter(({ id: itemId }) => itemId !== id));
  }, [items, setItems]);

  return (
    <div className="list-routes">
      {loading && <LoadingSpinner />}
      {!loading && (
        <ul className="list-routes-list">
          <li key="head" className="list-routes-list-head">
            <span className="origin">{'Origin'}</span>
            <span className="destination">{'Destination'}</span>
            <span className="length">{'Length'}</span>
            <span className="bearing">{'Bearing'}</span>
          </li>
          {items.map(({ id, ...rest }) => (
            <ListRoutesItem
              key={id}
              id={id}
              {...rest}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
      <StatusBar error={error} />
    </div>
  );
}
