import './App.css';
import AppBar from './components/AppBar';
import Drawer from './components/Drawer';
import Backdrop from './components/Backdrop';
import { useCallback, useMemo, useState } from 'react';
import useWindowDimensions from './hooks/useWindowDimensions';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Protected from './routes/Protected';
import { useAuth } from './providers/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Users from './routes/Users';
import Clients from './routes/Clients';
import Providers from './routes/Providers';
import Products from './routes/Products';
import Stock from './routes/Stock';
import NewSale from './routes/NewSale';
import PaymentMethods from './routes/PaymentMethods';
import Sales from './routes/Sales';
import SaleDetails from './routes/SaleDetails';
import Reports from './routes/Reports';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { width } = useWindowDimensions();
  const { user } = useAuth();

  const isSmallScreen = useMemo(() => width < 600, [width]);

  const toggleDrawerOpen = () => {
    setDrawerOpen((prevState) => !prevState);
  };
  const { pathname } = useLocation();

  const renderDrawer = useCallback(() => {
    if (!user) return null;
    return (
      <Drawer
        open={!isSmallScreen || drawerOpen}
        onToggleDrawer={isSmallScreen ? toggleDrawerOpen : undefined}
        admin={user.permissionName === 'ADMIN'}
      />
    );
  }, [drawerOpen, isSmallScreen, user]);

  return (
    <div className={pathname === '/login' ? 'container-full' : 'container'}>
      <AppBar
        onToggleDrawer={toggleDrawerOpen}
        showToggleButton={isSmallScreen && !!user}
      />
      {renderDrawer()}
      {drawerOpen && isSmallScreen && <Backdrop onClick={toggleDrawerOpen} />}
      <ToastContainer />
      <main>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route
            path='/'
            element={
              <Protected redirectPath='/login'>
                <Home />
              </Protected>
            }
          />
          <Route
            path='/clientes'
            element={
              <Protected redirectPath='/login'>
                <Clients />
              </Protected>
            }
          />
          <Route
            path='/fornecedores'
            element={
              <Protected redirectPath='/login'>
                <Providers />
              </Protected>
            }
          />
          <Route
            path='/produtos'
            element={
              <Protected redirectPath='/login'>
                <Products />
              </Protected>
            }
          />
          <Route
            path='/usuarios'
            element={
              <Protected redirectPath='/#' admin>
                <Users />
              </Protected>
            }
          />
          <Route
            path='/estoque'
            element={
              <Protected redirectPath='/#'>
                <Stock />
              </Protected>
            }
          />
          <Route
            path='/relatorios'
            element={
              <Protected redirectPath='/#'>
                <Reports />
              </Protected>
            }
          />
          <Route
            path='/novavenda'
            element={
              <Protected redirectPath='/#'>
                <NewSale />
              </Protected>
            }
          />
          <Route
            path='/vendas'
            element={
              <Protected redirectPath='/#'>
                <Sales />
              </Protected>
            }
          />
          <Route
            path='/formas-pagamento'
            element={
              <Protected redirectPath='/#'>
                <PaymentMethods />
              </Protected>
            }
          />
          <Route
            path='/vendas/:saleId'
            element={
              <Protected redirectPath='/#'>
                <SaleDetails />
              </Protected>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
