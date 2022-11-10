import React from 'react';
import { IAppBarProps } from '../AppBar/types';
import './style.css';

const DrawerToggle: React.FC<IAppBarProps> = ({ onToggleDrawer, showToggleButton }) => {
  return showToggleButton ? (
    <button className='toggle-button' onClick={() => onToggleDrawer()}>
      <div className='toggle-button__line' />
    </button>
  ) : (
    <div></div>
  );
};

export default DrawerToggle;
