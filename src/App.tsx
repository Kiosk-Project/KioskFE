import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { LandingPage } from './components/view/LandingPage';
import { LoginPage } from './components/view/LoginPage';
import { RegistrationPage } from './components/view/RegistrationPage';
import { StorageProvider } from './components/context/storage-context';
import OrderSubmit from './components/view/OrderSubmit';
import OrderPayment from './components/view/OrderPayment';

import OrderProducts from './components/view/OrderProducts';
import { PlaceSelectionPage } from './components/view/placeSelectionPage';

import { AdminPage } from './components/view/AdminPage';
import OrderRecommend from './components/view/OrderRecommend';
import { AdminUserListPage } from './components/view/admin/AdminUserListPage';
import { AdminOrderListPage } from './components/view/AdminOrderListPage';
import { AdminUserEditPage } from './components/view/admin/AdminUserEditPage';
import OrderDetail from './components/view/OrderDetail';

function App() {
  return (
    <BrowserRouter>
      <StorageProvider>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/placeselection' element={<PlaceSelectionPage />} />

          <Route path='/register' element={<RegistrationPage />} />
          <Route path='/order/products' element={<OrderProducts />} />
          <Route path='/order/payment' element={<OrderPayment />} />
          <Route path='/order/submit' element={<OrderSubmit />} />
          <Route path='/order/recommend' element={<OrderRecommend />} />
          <Route path='/order/detail' element={<OrderDetail />} />
          <Route path='/order/payment' element={<OrderPayment />} />
          <Route path='/order/submit' element={<OrderSubmit />} />
          <Route path='/admin/*' element={<AdminPage />}>
            {/* <Route index element={<AdminPageList />} /> */}
            {/* <Route path=':category' element={<AdminPageList />} /> */}
            <Route path='user' element={<AdminUserListPage />} />
            <Route path='user/:userId' element={<AdminUserEditPage />} />
            <Route path='order' element={<AdminOrderListPage />} />
          </Route>
        </Routes>
      </StorageProvider>
    </BrowserRouter>
  );
}

export default App;
