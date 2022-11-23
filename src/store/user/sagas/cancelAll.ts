import { ContractsNames } from 'config';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import apiActions from 'store/api/actions';
import userSelector from 'store/user/selectors';
import { getContractDataByItsName } from 'utils';

import { SwapAbi } from '../../../types/contracts/SwapAbi';
import { cancelAll } from '../actions';
import actionTypes from '../actionTypes';

export function* cancelAllSaga({ type, payload: { web3Provider } }: ReturnType<typeof cancelAll>) {
  yield put(apiActions.request(type));
  const myAddress = yield select(userSelector.getProp('address'));
  const [contractAbi, contractAddress] = getContractDataByItsName(ContractsNames.swap);
  try {
    const takerAssetContract: SwapAbi = yield new web3Provider.eth.Contract(contractAbi, contractAddress);
    yield call(takerAssetContract.methods.increaseNonce().send, {
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
  yield takeLatest(actionTypes.CANCEL_ALL, cancelAllSaga);
}
