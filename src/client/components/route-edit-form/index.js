import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { classNamePropType } from '~/client/constants/prop-types';
import { EMPTY_LINE } from '~/client/constants/route';
import RouteEditor from '~/client/components/route-editor';
import StatusBar from '~/client/components/status-bar';

import './style.scss';

export default function RouteEditForm({
  className,
  values,
  requestError,
  onSaveRequest,
}) {
  let initialOrigin = '';
  let initialDestination = '';
  let initialLine = EMPTY_LINE;
  if (values) {
    ({
      origin: initialOrigin = '',
      destination: initialDestination = '',
      ...initialLine
    } = values);
  }

  const [line, setLine] = useState(initialLine);
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);

  const [errors, setErrors] = useState({});

  const data = useMemo(() => ({
    origin,
    destination,
    ...line,
  }), [
    origin,
    destination,
    line,
  ]);

  const validate = useCallback(() => ({
    origin: !origin.length,
    destination: !destination.length,
    line: !line.points.length,
  }), [origin, destination, line.points]);

  const onSave = useCallback(() => {
    const currentErrors = validate();
    setErrors(currentErrors);

    if (Object.keys(currentErrors).some(key => currentErrors[key])) {
      return;
    }

    onSaveRequest(data);
  }, [data, validate, onSaveRequest]);

  return (
    <>
      <div className={classNames('route-edit-form', className)}>
        <div className="form-row">
          <span className="label">{'Origin:'}</span>
          <input
            className={classNames('input', 'input-text', { error: errors.origin })}
            value={origin}
            onChange={evt => setOrigin(evt.target.value)}
          />
        </div>
        <div className="form-row">
          <span className="label">{'Destination:'}</span>
          <input
            className={classNames('input', 'input-text', { error: errors.destination })}
            value={destination}
            onChange={evt => setDestination(evt.target.value)}
          />
        </div>
        <div className="form-row">
          <div className={classNames('route-editor-container', { error: errors.line })}>
            <RouteEditor initialLine={line} onChange={setLine} />
          </div>
        </div>
        <div className="form-row form-row-submit">
          <button
            className="button button-submit"
            onClick={onSave}
          >{'Save'}</button>
        </div>
      </div>
      <StatusBar error={requestError} />
    </>
  );
}

RouteEditForm.propTypes = {
  className: classNamePropType.isRequired,
  values: PropTypes.shape({
    origin: PropTypes.string,
    destination: PropTypes.string,
    route: PropTypes.object,
  }),
  requestError: PropTypes.string,
  onSaveRequest: PropTypes.func.isRequired,
};

RouteEditForm.defaultProps = {
  className: {},
};
