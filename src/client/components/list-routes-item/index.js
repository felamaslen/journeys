import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { useApi } from '~/client/hooks/api';

export default function ListRoutesItem({
  id,
  origin,
  destination,
  length,
  bearing,
  onDelete,
}) {
  const onSuccess = useCallback(() => {
    onDelete(id);
  }, [onDelete, id]);

  const [requestDelete, error, deleting] = useApi({
    method: 'delete',
    url: `routes/${id}`,
    onSuccess,
  });

  const onDeleteHandler = useCallback(() => {
    requestDelete();
  }, [requestDelete]);

  return (
    <li key={id} className={classNames('list-routes-list-item', {
      deleting,
      error,
    })}>
      <span className="origin">{origin}</span>
      <span className="destination">{destination}</span>
      <span className="length">{length}</span>
      <span className="bearing">{bearing}</span>
      <span className="view">
        <Link
          className="view-link"
          to={`/routes/${id}`}
        >{'View'}</Link>
      </span>
      <span className="edit">
        <Link
          className="edit-link"
          to={`/routes/${id}/edit`}
        >{'Edit'}</Link>
      </span>
      <span className="delete">
        <button
          className="delete-link"
          onClick={onDeleteHandler}
        >{'Delete'}</button>
      </span>
    </li>
  );
}

ListRoutesItem.propTypes = {
  id: PropTypes.string.isRequired,
  origin: PropTypes.string.isRequired,
  destination: PropTypes.string,
  length: PropTypes.number.isRequired,
  bearing: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};
