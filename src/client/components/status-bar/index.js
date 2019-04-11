import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

export default function StatusBar({ error }) {
  return (
    <div className={classNames('status', { error })}>
      {error}
    </div>
  );
}

StatusBar.propTypes = {
  error: PropTypes.string,
};
