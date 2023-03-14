import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { HomePage } from '~/pages';

import Login from '~/pages/Login';
import { TIME_COOKIES_USER, userLogout } from '~/redux/slices/user';
import { Infomation, Statistics } from '~/components/HomePage';

function PrivateOutlet() {
  const { user, timestamp } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (timestamp !== null && new Date().getTime() - timestamp > TIME_COOKIES_USER) {
      dispatch(userLogout());
    }
  }, [dispatch, timestamp]);

  return user ? <Outlet /> : <Navigate to="/login" />;
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<PrivateOutlet />}>
          <Route path="home/*" element={<HomePage />} />
        </Route>
        <Route path="/">
          <Route path="/" element={<Navigate to="/app/home" />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
