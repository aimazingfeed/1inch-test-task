import { createAction } from '@reduxjs/toolkit';
import { CancelLimitOrder, RequestWithWeb3Provider, SendLimitOrder } from 'types/requests';

import actionTypes from './actionTypes';

export const getUserBalance = createAction<RequestWithWeb3Provider>(actionTypes.GET_USER_BALANCE);
export const sendLimitOrder = createAction<SendLimitOrder>(actionTypes.SEND_LIMIT_ORDER);
export const cancelLimitOrder = createAction<CancelLimitOrder>(actionTypes.SEND_LIMIT_ORDER);
