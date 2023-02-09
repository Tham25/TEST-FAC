/* eslint-disable react/jsx-no-comment-textnodes */
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Grid, Stack } from '@mui/material';
import classNames from 'classnames/bind';

import Page from '~/components/Page';
import LoginForm from '~/components/Authentication/LoginForm';
import Logo from '~/components/Logo';
import styles from './Login.module.scss';

const cx = classNames.bind(styles);

function CheckLogin() {
  const { user } = useSelector((state) => state.user);
  return user ? <Navigate to="/" /> : <Outlet />;
}

function Login() {
  return (
    <Page title="Factory Management" className={cx('wrapper')}>
      {CheckLogin()}
      <Grid container className={cx('container')}>
        <Stack sx={{ mt: 2, mb: 2 }}>
          <Logo sx={{ width: 100, m: 'auto' }} />
          <span className={cx('login-heading')}>Welcome to Factory Management</span>
          <span className={cx('login-descr')}>Enter your details below</span>
          <LoginForm />
        </Stack>
      </Grid>
    </Page>
  );
}

export default Login;
