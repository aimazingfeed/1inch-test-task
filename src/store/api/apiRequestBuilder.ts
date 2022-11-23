import { URL } from 'appConstants';

import ajax from './ajax';

export const baseApi = {
  sendLimitOrder(data) {
    return ajax({
      method: 'post',
      url: URL.sendLimitOrder(),
      data,
    });
  },
};
