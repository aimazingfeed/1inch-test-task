import { LimitOrderBuilder, LimitOrderProtocolFacade, Web3ProviderConnector } from '@1inch/limit-order-protocol';
import { ContractsNames } from 'config';
import { bep20Abi } from 'config/abi';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import apiActions from 'store/api/actions';
import userSelector from 'store/user/selectors';
import { getContractDataByItsName, toDecimals } from 'utils';

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
    // @ts-ignore
    const connector = new Web3ProviderConnector(web3Provider);
    const chainId = yield call(web3Provider.eth.net.getId);
    const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, connector);
    const limitOrderBuilder = new LimitOrderBuilder(contractAddress, chainId, connector);
    const makerAssetContract = new web3Provider.eth.Contract(bep20Abi, formValues.makerAssetAddress);
    const makerAssetDecimals = yield call(makerAssetContract.methods.decimals().call);
    const takerAssetContract = new web3Provider.eth.Contract(bep20Abi, formValues.takerAssetAddress);
    const takerAssetDecimals = yield call(takerAssetContract.methods.decimals().call);
    const limitOrder = limitOrderBuilder.buildLimitOrder({
      makerAddress: myAddress,
      ...formValues,
      takerAmount: toDecimals(formValues.takerAmount, takerAssetDecimals),
      makerAmount: toDecimals(formValues.makerAmount, makerAssetDecimals),
    });
    const callData = limitOrderProtocolFacade.cancelLimitOrder(limitOrder);
    yield web3Provider.eth.sendTransaction({
      from: myAddress,
      to: contractAddress,
      gas: '88600',
      gasPrice: '30600000000',
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
