import { createAction } from '@reduxjs/toolkit';
import { CancelLimitOrder, RequestWithWeb3Provider, SendLimitOrder } from 'types/requests';

import actionTypes from './actionTypes';

export const sendLimitOrder = createAction<SendLimitOrder>(actionTypes.SEND_LIMIT_ORDER);
export const cancelLimitOrder = createAction<CancelLimitOrder>(actionTypes.CANCEL_LIMIT_ORDER);
export const cancelAll = createAction<RequestWithWeb3Provider>(actionTypes.CANCEL_ALL);
