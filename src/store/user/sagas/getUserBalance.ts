import { ContractsNames } from 'config';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import apiActions from 'store/api/actions';
import { updateUserState } from 'store/user/reducer';
import userSelector from 'store/user/selectors';
import { SwapAbi } from 'types/contracts';
import { getContractDataByItsName } from 'utils';

import { getUserBalance } from '../actions';
import actionTypes from '../actionTypes';

export function* getUserBalanceSaga({ type, payload: { web3Provider } }: ReturnType<typeof getUserBalance>) {
  yield put(apiActions.request(type));
  const myAddress = yield select(userSelector.getProp('address'));
  const [contractAbi, contractAddress] = getContractDataByItsName(ContractsNames.swap);
  try {
    const contract: SwapAbi = yield new web3Provider.eth.Contract(contractAbi, contractAddress);
    const balance = yield call(contract.methods.nonce(myAddress).call); // TODO: Fix
    yield put(updateUserState({}));
    yield put(apiActions.success(type));
  } catch (err) {
    yield put(apiActions.error(type, err));
    console.error(err);
  }
}

export default function* listener() {
  yield takeLatest(actionTypes.GET_USER_BALANCE, getUserBalanceSaga);
}
