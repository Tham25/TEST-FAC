import { deleteUser, getUser } from '~/utils/user';
import { UrlPath } from './index';
import { request } from './request';

export const login = async (username, password, remember) => {
  const data = { username, password, remember };
  try {
    const response = await request({
      path: UrlPath.user_login_url,
      method: 'post',
      data,
      refresh: false,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR login fail', e);
    if (e.response) {
      return Promise.reject(Error('User or password incorrect!'));
    }
    return Promise.reject(Error('Network error!'));
  }
};

export const logout = async () => Promise.resolve();

export const refreshToken = async () => {
  let token = '';
  try {
    token = getUser().token.refresh;
  } catch (e) {
    // Do nothing
  }

  const data = { refresh: token };
  try {
    const response = await request({
      path: '/api/token/refresh/',
      method: 'post',
      data,
      refresh: false,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      deleteUser();
      window.location.reload();
    }
    return Promise.reject(error);
  }
};
