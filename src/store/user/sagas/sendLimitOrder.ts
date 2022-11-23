import { LimitOrderBuilder, LimitOrderProtocolFacade, Web3ProviderConnector } from '@1inch/limit-order-protocol';
import BigNumber from 'bignumber.js';
import { ContractsNames } from 'config';
import { bep20Abi } from 'config/abi';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import apiActions from 'store/api/actions';
import { baseApi } from 'store/api/apiRequestBuilder';
import userSelector from 'store/user/selectors';
import { getContractDataByItsName } from 'utils';

import { toDecimals } from '../../../utils/formatTokenAmount';
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

    const limitOrderBuilder = new LimitOrderBuilder(contractAddress, chainId, connector);
    const makerAssetContract = new web3Provider.eth.Contract(bep20Abi, formValues.makerAssetAddress);
    const makerAssetDecimals = yield call(makerAssetContract.methods.decimals().call);

    const takerAssetContract = new web3Provider.eth.Contract(bep20Abi, formValues.takerAssetAddress);
    const takerAssetDecimals = yield call(takerAssetContract.methods.decimals().call);

    const makerAmount = toDecimals(formValues.makerAmount, makerAssetDecimals);
    const takerAmount = toDecimals(formValues.takerAmount, takerAssetDecimals);

    // allowance
    const allowanceValue = yield call(makerAssetContract.methods.allowance(myAddress, contractAddress).call);
    if (new BigNumber(allowanceValue).isLessThan(new BigNumber(makerAmount))) {
      const newAmount = new BigNumber(makerAmount).minus(allowanceValue).toString();
      yield call(makerAssetContract.methods.approve(contractAddress, newAmount).send, {
        from: myAddress,
        gas: '88600',
        gasPrice: '30600000000',
      });
    }

    const limitOrder = limitOrderBuilder.buildLimitOrder({
      makerAddress: myAddress,
      ...formValues,
      takerAmount,
      makerAmount,
    });
    const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder);
    const limitOrderSignature = yield limitOrderBuilder.buildOrderSignature(myAddress, limitOrderTypedData);
    const limitOrderHash = limitOrderBuilder.buildLimitOrderHash(limitOrderTypedData);
    const apiData = {
      orderHash: limitOrderHash,
      signature: limitOrderSignature,
      data: limitOrderTypedData.message,
    };
    yield call(baseApi.sendLimitOrder, apiData);
    yield put(apiActions.success(type));
  } catch (err) {
    yield put(apiActions.error(type, err));
    console.error(err);
  }
}

export default function* listener() {
  yield takeLatest(actionTypes.SEND_LIMIT_ORDER, sendLimitOrderSaga);
}
