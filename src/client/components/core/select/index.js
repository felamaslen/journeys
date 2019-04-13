import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

export default function Select({ children, className, ...props }) {
  return (
    <div className={classNames('select-custom', className)}>
      <select className="select-custom-select" {...props}>
        {children}
      </select>
    </div>
  );
}

Select.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  children: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
};

Select.defaultProps = {
  className: {},
};
