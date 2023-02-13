import { UrlPath } from '.';
import { request } from './request';

export const getStatisticsInfo = async (timeBonus) => {
  try {
    const response = await request({
      path: `${UrlPath.get_statistics_url}/${timeBonus}`,
      refresh: false,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR getListStatistics fail', e);
    return Promise.reject(Error(e));
  }
};
