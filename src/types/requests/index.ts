import { LimitOrderModel } from 'forms/LimitOrder';
import Web3 from 'web3';

export interface RequestWithWeb3Provider {
  web3Provider: Web3;
}

export interface SendLimitOrder extends RequestWithWeb3Provider {
  formValues: LimitOrderModel;
}

export type CancelLimitOrder = SendLimitOrder;
