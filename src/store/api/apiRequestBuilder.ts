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
  getLimitOrders(data) {
    return ajax({
      method: 'get',
      url: URL.getLimitOrdersByAddress(data.address),
    });
  },
};
