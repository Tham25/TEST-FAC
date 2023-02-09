import { request } from './request';

export const getLotOptions = async () => {
  try {
    const response = await request({
      path: '/device/lot?getall=true',
      refresh: false,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR getLotOptions fail', e);
    return Promise.reject(e);
  }
};
