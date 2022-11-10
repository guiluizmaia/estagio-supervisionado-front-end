import React from 'react';
import { Link } from 'react-router-dom';
import DrawerToggle from '../DrawerToggle';
import './style.css';
import { IAppBarProps } from './types';

const AppBar: React.FC<IAppBarProps> = ({ ...props }) => {
  return (
    <header className='appbar'>
      <nav className='appbar__navigation'>
        <DrawerToggle {...props} />
        <div className='appbar__logo'>
          <Link to='/#'>
            <img src='assets/logo.jpeg' alt='example' />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default AppBar;
