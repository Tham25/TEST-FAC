import { request } from './request';
import { UrlPath } from './index';

export const getLotOptions = async () => {
  try {
    const response = await request({
      path: UrlPath.get_lot,
      refresh: false,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR getLotOptions fail', e);
    return Promise.reject(e);
  }
};
