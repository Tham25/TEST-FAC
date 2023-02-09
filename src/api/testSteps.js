import { request } from './request';

export const getTestStepsAPI = async (SN) => {
  try {
    const response = await request({
      path: `/device/step-test-info?serial_number=${SN}`,
      refresh: false,
    });
    return Promise.resolve(response.data);
  } catch (e) {
    console.log('ERROR getTestSteps fail', e);
    return Promise.reject(e);
  }
};
