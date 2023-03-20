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

export const getAssyHistory = async (field, asssyId) => {
  try {
    const response = await request({
      path: UrlPath.get_assy_history,
      refresh: false,
      params: {
        [field]: asssyId,
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

export const mappingAssyId = async (assyForm) => {
  try {
    const response = await request({
      method: 'post',
      path: UrlPath.mapping_assy_id,
      refresh: false,
      data: assyForm,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR mappingAssyId fail', e);
    return Promise.reject(e);
  }
};

export const checkAssyIds = async (assyIds) => {
  try {
    const response = await request({
      method: 'post',
      path: UrlPath.check_assy_ids,
      refresh: false,
      data: assyIds,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR chekAssyIds fail', e);
    return Promise.reject(e);
  }
};
