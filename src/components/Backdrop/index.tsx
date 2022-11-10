/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { PropsWithChildren } from 'react';
import './style.css';

interface IBackdropProps {
  onClick: VoidFunction;
}

const Backdrop: React.FC<PropsWithChildren<IBackdropProps>> = ({
  onClick,
  children,
}) => {
  return (
    <div className='backdrop' onClick={() => onClick()}>
      {children}
    </div>
  );
};

export default Backdrop;
