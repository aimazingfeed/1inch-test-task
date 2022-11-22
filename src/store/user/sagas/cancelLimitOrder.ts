import { LimitOrderBuilder, LimitOrderProtocolFacade, Web3ProviderConnector } from '@1inch/limit-order-protocol';
import { ContractsNames } from 'config';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import apiActions from 'store/api/actions';
import userSelector from 'store/user/selectors';
import { getContractDataByItsName } from 'utils';

import { cancelLimitOrder } from '../actions';
import actionTypes from '../actionTypes';

export function* cancelLimitOrderSaga({
  type,
  payload: { web3Provider, formValues },
}: ReturnType<typeof cancelLimitOrder>) {
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
      predicate: '0x0',
      permit: '0x0',
      interaction: '0x0',
    });
    const callData = limitOrderProtocolFacade.cancelLimitOrder(limitOrder);
    web3Provider.eth.sendTransaction({
      from: myAddress,
      gas: 210_000,
      gasPrice: 40000,
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
  yield takeLatest(actionTypes.CANCEL_LIMIT_ORDER, cancelLimitOrderSaga);
}
