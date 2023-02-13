import { UrlPath } from '.';
import { request } from './request';

export const getTestStepsAPI = async (SN) => {
  try {
    const response = await request({
      path: `${UrlPath.get_infomation_by_SN}${SN}`,
      refresh: false,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR getTestSteps fail', e);
    return Promise.reject(e);
  }
};
