import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import './style.css';

type MenuOption =
  | {
      text: string;
      icon: string;
      link: string;
      action?: undefined;
    }
  | {
      text: string;
      icon: string;
      action: VoidFunction;
      link?: undefined;
    };

const Drawer: React.FC<{
  open: boolean;
  onToggleDrawer?: VoidFunction;
  admin: boolean;
}> = ({ open, onToggleDrawer, admin }) => {
  const navigation = useNavigate();
  const { logout } = useAuth();

  const menuOptions: MenuOption[] = [
    {
      text: 'Clientes',
      icon: 'bi bi-people',
      link: '/clientes',
    },
    {
      text: 'Vendas',
      icon: 'bi bi-cart4',
      link: '/vendas',
    },

    {
      text: 'Estoque',
      icon: 'bi bi-boxes',
      link: '/estoque',
    },
    {
      text: 'Produtos',
      icon: 'bi bi-boxes',
      link: '/produtos',
    },
    {
      text: 'Fornecedores',
      icon: 'bi bi-boxes',
      link: '/fornecedores',
    },
    {
      text: 'Formas de pagamento',
      icon: 'bi bi-credit-card-2-back',
      link: '/formas-pagamento',
    },
    {
      text: 'Sair',
      icon: 'bi bi-arrow-bar-left',
      action: logout,
    },
  ];

  if (admin) {
    menuOptions.splice(menuOptions.length - 1, 0, {
      text: 'Usuários',
      icon: 'bi bi-person-badge',
      link: '/usuarios',
    });

    menuOptions.splice(menuOptions.length - 1, 0, {
      text: 'Relatórios',
      icon: 'bi bi-bar-chart-line',
      link: '/relatorios',
    });
  }

  const handleMenuClick = (option: MenuOption) => {
    option.link && navigation(option.link);
    option.action && option.action();

    onToggleDrawer && setTimeout(() => onToggleDrawer(), 200);
  };

  return !open ? null : (
    <nav className='side-drawer'>
      <ul className='side-drawer__menu'>
        {menuOptions.map((option, index) => (
          <button
            key={index}
            className='side-drawer__menu-item'
            onClick={(e) => {
              e.currentTarget.blur();
              handleMenuClick(option);
            }}
          >
            <i className={option.icon}></i>
            <span>{option.text}</span>
          </button>
        ))}
      </ul>
    </nav>
  );
};

export default Drawer;
