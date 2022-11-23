import { ContractsNames } from 'config';
import { bep20Abi } from 'config/abi';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import apiActions from 'store/api/actions';
import { baseApi } from 'store/api/apiRequestBuilder';
import userSelector from 'store/user/selectors';
import { SwapAbi } from 'types/contracts';
import { getContractDataByItsName, toDecimals, validateStatus } from 'utils';

import { cancelLimitOrder } from '../actions';
import actionTypes from '../actionTypes';

export function* cancelLimitOrderSaga({
  type,
  payload: { web3Provider, formValues },
}: ReturnType<typeof cancelLimitOrder>) {
  yield put(apiActions.request(type));
  const myAddress = yield select(userSelector.getProp('address'));
  const [contractAbi, contractAddress] = getContractDataByItsName(ContractsNames.swap);
  try {
    const swapContract: SwapAbi = yield new web3Provider.eth.Contract(contractAbi, contractAddress);
    const response = yield call(baseApi.getLimitOrders, { address: myAddress });
    if (!validateStatus(response.status)) return;
    const limitOrders = response.data;
    const makerAssetContract = new web3Provider.eth.Contract(bep20Abi, formValues.makerAssetAddress);
    const makerAssetDecimals = yield call(makerAssetContract.methods.decimals().call);

    const takerAssetContract = yield new web3Provider.eth.Contract(bep20Abi, formValues.takerAssetAddress);
    const takerAssetDecimals = yield call(takerAssetContract.methods.decimals().call);

    const makerAmount = toDecimals(formValues.makerAmount, makerAssetDecimals);
    const takerAmount = toDecimals(formValues.takerAmount, takerAssetDecimals);
    const currentOrder = limitOrders?.find(
      (order) =>
        makerAmount === order.data.makingAmount &&
        takerAmount === order.data.takingAmount &&
        web3Provider.utils.toChecksumAddress(formValues.makerAssetAddress) ===
          web3Provider.utils.toChecksumAddress(order.data.makerAsset) &&
        web3Provider.utils.toChecksumAddress(formValues.takerAssetAddress) ===
          web3Provider.utils.toChecksumAddress(order.data.takerAsset) &&
        order,
    );
    yield call(swapContract.methods.cancelOrder(currentOrder?.data).send, {
      from: myAddress,
      gas: '88600',
      gasPrice: '30600000000',
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
