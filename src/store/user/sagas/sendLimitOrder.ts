import { LimitOrderBuilder, LimitOrderProtocolFacade, Web3ProviderConnector } from '@1inch/limit-order-protocol';
import { ContractsNames } from 'config';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import apiActions from 'store/api/actions';
import userSelector from 'store/user/selectors';
import { getContractDataByItsName } from 'utils';

import { sendLimitOrder } from '../actions';
import actionTypes from '../actionTypes';

export function* sendLimitOrderSaga({
  type,
  payload: { web3Provider, formValues },
}: ReturnType<typeof sendLimitOrder>) {
  yield put(apiActions.request(type));
  const myAddress = yield select(userSelector.getProp('address'));
  const [, contractAddress] = getContractDataByItsName(ContractsNames.swap);
  try {
    // @ts-ignore - library error
    const connector = new Web3ProviderConnector(web3Provider);
    const chainId = yield call(web3Provider.eth.net.getId);
    const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, connector);
    const limitOrderBuilder = new LimitOrderBuilder(contractAddress, chainId, connector);
    const limitOrder = limitOrderBuilder.buildLimitOrder({
      makerAddress: myAddress,
      ...formValues,
    });
    const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder);
    const limitOrderSignature = yield limitOrderBuilder.buildOrderSignature(myAddress, limitOrderTypedData);
    const callData = yield limitOrderProtocolFacade.fillLimitOrder(limitOrder, limitOrderSignature, '100', '0', '50');
    yield web3Provider.eth.sendTransaction({
      from: myAddress,
      to: contractAddress,
      data: callData,
    });
    yield put(apiActions.success(type));
  } catch (err) {
    yield put(apiActions.error(type, err));
    console.error(err);
  }
}

export default function* listener() {
  yield takeLatest(actionTypes.SEND_LIMIT_ORDER, sendLimitOrderSaga);
}
