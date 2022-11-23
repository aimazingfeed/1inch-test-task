import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'clsx';
import { Formik } from 'formik';
import { useShallowSelector } from 'hooks';
import { useWalletConnectorContext } from 'services';
import { cancelAll, cancelLimitOrder, sendLimitOrder } from 'store/user/actions';
import userSelector from 'store/user/selectors';
import { State, UserState } from 'types';

import { initialValues, poolValidationSchema } from './LimitOrder.config';

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
  const dispatch = useDispatch();
  const { address } = useShallowSelector<State, UserState>(userSelector.getUser);
  const { walletService } = useWalletConnectorContext();
  const [activeTab, setActiveTab] = useState<FormsType>(FormsType.send);

  const isSendTabActive = activeTab === FormsType.send;

  const handleSubmitForm = (values: LimitOrderModel) => {
    if (isSendTabActive) dispatch(sendLimitOrder({ formValues: values, web3Provider: walletService }));
    else dispatch(cancelLimitOrder({ formValues: values, web3Provider: walletService }));
  };
  const handleCancelAll = () => {
    dispatch(cancelAll({ web3Provider: walletService }));
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

            <button className={s.formButton} type="submit" disabled={!address}>
              {isSendTabActive ? 'Send' : 'Cancel'} limit order
            </button>
            {!isSendTabActive && (
              <button
                className={cn(s.formButton, s.cancelButton)}
                type="button"
                onClick={handleCancelAll}
                disabled={!address}
              >
                Cancel all orders
              </button>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
};
