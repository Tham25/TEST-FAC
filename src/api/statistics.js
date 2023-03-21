import { UrlPath } from '.';
import { request } from './request';

export const getListTool = async (infoSearch) => {
  try {
    const response = await request({
      path: UrlPath.get_statistics_url,
      refresh: false,
      params: infoSearch,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR getListTool fail', e);
    return Promise.reject(Error(e));
  }
};

export const getInfoCircuitAssy = async (infoSearch) => {
  try {
    const response = await request({
      path: '',
      refresh: false,
      params: infoSearch,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.log('ERROR getInfoCircuitAssy fail', error);
    return Promise.reject(Error(error));
  }
};
