export default {
  sendLimitOrder: () => '/v2.0/137/limit-order/',
  getLimitOrdersByAddress: (address: string) => `/v2.0/137/limit-order/address/${address}`,
};
