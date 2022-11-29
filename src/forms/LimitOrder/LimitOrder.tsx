import { FC, useEffect, useState } from 'react';
import { LimitOrderBuilder, Web3ProviderConnector } from '@1inch/limit-order-protocol';
import { URL } from 'appConstants';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import cn from 'clsx';
import { ContractsNames } from 'config';
import { bep20Abi } from 'config/abi';
import { Formik } from 'formik';
import { useShallowSelector } from 'hooks';
import { useWalletConnectorContext } from 'services';
import userSelector from 'store/user/selectors';
import { State, UserState } from 'types';
import { SwapAbi } from 'types/contracts';
import { getContractDataByItsName, toDecimals, validateStatus } from 'utils';

import { initialValues, poolValidationSchema } from './LimitOrder.config';
import { OrderHistoryItem } from './OrderHistoryItem';

import s from './styles.module.scss';

export interface LimitOrderModel {
  makerAssetAddress: string;
  takerAssetAddress: string;
  makerAmount: string;
  takerAmount: string;
}
export interface LimitOrderProps {
  className?: string;
}
enum FormsType {
  send = 'send',
  cancel = 'cancel',
}

export const LimitOrder: FC<LimitOrderProps> = ({ className }) => {
  const { address } = useShallowSelector<State, UserState>(userSelector.getUser);
  const { walletService } = useWalletConnectorContext();
  const [contractAbi, contractAddress] = getContractDataByItsName(ContractsNames.swap);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<FormsType>(FormsType.send);
  const [limitOrders, setLimitOrders] = useState(null);
  const isSendTabActive = activeTab === FormsType.send;
  const isFormButtonDisabled = !isLoading && !!address;

  axios.defaults.baseURL = 'https://limit-orders.1inch.io';

  useEffect(() => {
    let pageClosed = false;
    if (!pageClosed) {
      (async () => {
        const response = await axios.get(URL.getLimitOrdersByAddress(address));
        if (!validateStatus(response.status)) return;
        if (!pageClosed) setLimitOrders(response.data);
      })();
    }
    return () => {
      pageClosed = true;
    };
  }, [address]);

  const getTokenDecimals = async (tokenAddress): Promise<number> => {
    try {
      const assetContract = new walletService.eth.Contract(bep20Abi, tokenAddress);
      const assetDecimals = await assetContract.methods.decimals().call();
      return assetDecimals;
    } catch (err) {
      console.error(err);
    }
    return 0;
  };
  const sendOrder = async (formValues) => {
    try {
      // @ts-ignore
      const swapContract: SwapAbi = new walletService.eth.Contract(contractAbi, contractAddress);
      // @ts-ignore
      const connector = new Web3ProviderConnector(walletService);
      const chainId = await walletService.eth.net.getId();

      const limitOrderBuilder = new LimitOrderBuilder(contractAddress, chainId, connector);

      const makerAssetContract = new walletService.eth.Contract(bep20Abi, formValues.makerAssetAddress);
      const makerAssetDecimals = await getTokenDecimals(formValues.makerAssetAddress);

      const takerAssetDecimals = await getTokenDecimals(formValues.takerAssetAddress);

      const makerAmount = toDecimals(formValues.makerAmount, makerAssetDecimals);
      const takerAmount = toDecimals(formValues.takerAmount, takerAssetDecimals);
      // nonce
      const nonce = await swapContract.methods.nonce(address).call();
      const predicate = await swapContract.methods.nonceEquals(address, nonce).call();

      // allowance
      const allowanceValue = await makerAssetContract.methods.allowance(address, contractAddress).call();
      if (new BigNumber(allowanceValue).isLessThan(new BigNumber(makerAmount))) {
        const newAmount = new BigNumber(makerAmount).minus(allowanceValue).toString();
        await makerAssetContract.methods.approve(contractAddress, newAmount).send({
          from: address,
          gas: '88600',
          gasPrice: '46600000000',
        });
      }
      const limitOrder = limitOrderBuilder.buildLimitOrder({
        ...formValues,
        makerAddress: address,
        takerAmount,
        makerAmount,
        predicate,
      });
      const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder);
      const limitOrderSignature = await limitOrderBuilder.buildOrderSignature(address, limitOrderTypedData);
      const limitOrderHash = limitOrderBuilder.buildLimitOrderHash(limitOrderTypedData);
      const apiData = {
        orderHash: limitOrderHash,
        signature: limitOrderSignature,
        data: limitOrderTypedData.message,
      };
      await axios.post(URL.sendLimitOrder(), apiData);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };
  const cancelOrder = async (formValues) => {
    try {
      const swapContract = new walletService.eth.Contract(contractAbi, contractAddress);
      const makerAssetContract = new walletService.eth.Contract(bep20Abi, formValues.makerAssetAddress);
      const makerAssetDecimals = await makerAssetContract.methods.decimals().call();

      const takerAssetContract = new walletService.eth.Contract(bep20Abi, formValues.takerAssetAddress);
      const takerAssetDecimals = await takerAssetContract.methods.decimals().call();

      const makerAmount = toDecimals(formValues.makerAmount, makerAssetDecimals);
      const takerAmount = toDecimals(formValues.takerAmount, takerAssetDecimals);
      const currentOrder = limitOrders?.find(
        (order) =>
          makerAmount === order.data.makingAmount &&
          takerAmount === order.data.takingAmount &&
          walletService.utils.toChecksumAddress(formValues.makerAssetAddress) ===
            walletService.utils.toChecksumAddress(order.data.makerAsset) &&
          walletService.utils.toChecksumAddress(formValues.takerAssetAddress) ===
            walletService.utils.toChecksumAddress(order.data.takerAsset) &&
          order,
      );
      await swapContract.methods.cancelOrder(currentOrder?.data).send({
        from: address,
        gas: '88600',
        gasPrice: '46600000000',
      });
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };
  const handleSubmitForm = (values: LimitOrderModel) => {
    setIsLoading(true);
    if (isSendTabActive) sendOrder(values);
    else cancelOrder(values);
    setIsLoading(false);
  };
  const handleCancelAll = async () => {
    try {
      const swapContract = new walletService.eth.Contract(contractAbi, contractAddress);
      await swapContract.methods.increaseNonce().send({
        from: address,
        gas: '88600',
        gasPrice: '46600000000',
      });
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <div className={cn(s.limitOrder, className)}>
      <div className={s.tabsSwitcherContainer}>
        <button
          className={cn(s.tabSwitcher, { [s.active]: isSendTabActive })}
          type="button"
          onClick={() => setActiveTab(FormsType.send)}
        >
          Send
        </button>
        <button
          className={cn(s.tabSwitcher, { [s.active]: !isSendTabActive })}
          type="button"
          onClick={() => setActiveTab(FormsType.cancel)}
        >
          Cancel
        </button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={poolValidationSchema()}
        onSubmit={(values) => {
          handleSubmitForm(values);
        }}
      >
        {({ getFieldProps, touched, errors, handleSubmit }) => (
          <form className={cn(s.innerForm, s.editForm)} onSubmit={handleSubmit}>
            <div className={s.inputWrapper}>
              <input
                className={s.formInput}
                name="makerAssetAddress"
                placeholder="Asset's address to sell"
                {...getFieldProps('makerAssetAddress')}
              />
              {touched.makerAssetAddress && errors.makerAssetAddress && (
                <p className={s.errorInfo}>{String(errors.makerAssetAddress)}</p>
              )}
            </div>
            <div className={s.inputWrapper}>
              <input
                className={s.formInput}
                name="makerAmount"
                placeholder="Amount of selling asset"
                {...getFieldProps('makerAmount')}
              />
              {touched.makerAmount && errors.makerAmount && <p className={s.errorInfo}>{String(errors.makerAmount)}</p>}
            </div>
            <div className={s.inputWrapper}>
              <input
                className={s.formInput}
                name="takerAssetAddress"
                placeholder="Asset's address to buy"
                {...getFieldProps('takerAssetAddress')}
              />
              {touched.takerAssetAddress && errors.takerAssetAddress && (
                <p className={s.errorInfo}>{String(errors.takerAssetAddress)}</p>
              )}
            </div>
            <div className={s.inputWrapper}>
              <input
                className={s.formInput}
                name="takerAmount"
                placeholder="Amount of buying asset"
                {...getFieldProps('takerAmount')}
              />
              {touched.takerAmount && errors.takerAmount && <p className={s.errorInfo}>{String(errors.takerAmount)}</p>}
            </div>

            <button className={s.formButton} type="submit" disabled={isFormButtonDisabled}>
              {isSendTabActive ? 'Send' : 'Cancel'} limit order
            </button>
            {!isSendTabActive && (
              <button
                className={cn(s.formButton, s.cancelButton)}
                type="button"
                onClick={handleCancelAll}
                disabled={isFormButtonDisabled}
              >
                Cancel all orders
              </button>
            )}
          </form>
        )}
      </Formik>
      <div className={s.historyContainer}>
        <p className={s.titleContainer}>
          Last{' '}
          {limitOrders && Object.keys(limitOrders)?.length ? `${Object.keys(limitOrders)?.length} transactions` : ''}
        </p>
        <div>
          {limitOrders &&
            Object.values(limitOrders).map((order: any) => (
              <OrderHistoryItem
                key={order.data.salt}
                takingAmount={order?.data?.takingAmount}
                makingAmount={order?.data?.makingAmount}
                takerAsset={order?.data?.takerAsset}
                makerAsset={order?.data?.makerAsset}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
