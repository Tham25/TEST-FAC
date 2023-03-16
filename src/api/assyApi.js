import { UrlPath } from '.';
import { request } from './request';

export const getAssyTemplate = async () => {
  try {
    const response = await request({
      path: UrlPath.get_assy_template,
      refresh: false,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR getAssyTemplate fail', e);
    return Promise.reject(e);
  }
};

export const getAssyHistory = async (asssyId) => {
  try {
    const response = await request({
      path: UrlPath.get_assy_history,
      refresh: false,
      params: {
        id_assy: asssyId,
      },
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR getAssyHistory fail', e);
    return Promise.reject(e);
  }
};

export const createAssyHistory = async (assyForm) => {
  try {
    const response = await request({
      method: 'put',
      path: UrlPath.create_assy_history,
      refresh: false,
      data: assyForm,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR createAssyHistory fail', e);
    return Promise.reject(e);
  }
};
