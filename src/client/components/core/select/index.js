import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { classNamePropType } from '~/client/constants/prop-types';

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
  className: classNamePropType.isRequired,
  children: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
};

Select.defaultProps = {
  className: {},
};
