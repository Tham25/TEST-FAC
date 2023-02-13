import axios from 'axios';
import { parse, stringify } from 'qs';
import { refreshToken } from './sessions';
import { getUser, setUser, isEditableUser } from '~/utils/user';

export const host = process.env.REACT_APP_BASE_URL || undefined;

const defaultRequest = {
  path: '/',
  method: 'get',
  data: {},
  headers: {},
  params: {},
  check_edit_permission: false,
  refresh: true,
  refresh_count: 0,
};

export async function request(config) {
  return new Promise((resolve, reject) => {
    config = { ...defaultRequest, ...config };
    // Get token
    let { token } = config;
    let editPermission = true;
    if (!token) {
      try {
        token = getUser().token;
        editPermission = isEditableUser(getUser());
      } catch (e) {
        // Do nothing
      }
    }
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    if (config.check_edit_permission) {
      if (!editPermission) {
        reject(Error('No permission'));
      }
    }

    axios({
      // baseURL: host,
      url: config.path,
      method: config.method,
      data: config.data,
      params: config.params,
      paramsSerializer: {
        encode: parse,
        serialize: stringify,
      },
      headers: config.headers,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        if (
          config.refresh &&
          config.refresh_count < 5 &&
          error.response &&
          error.response.status === 401
        ) {
          // Try refresh token
          refreshToken()
            .then((response) => {
              // Try again
              config.refresh_count += 1;
              request({ ...config, token: response.access })
                .then(resolve)
                .catch(reject);
              setUser({ ...getUser(), token: response }, getUser().remember);
            })
            .catch(reject);
        } else {
          reject(error);
        }
      });
  });
}
