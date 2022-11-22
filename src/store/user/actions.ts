import { createAction } from '@reduxjs/toolkit';
import { CancelLimitOrder, SendLimitOrder } from 'types/requests';

import actionTypes from './actionTypes';

export const sendLimitOrder = createAction<SendLimitOrder>(actionTypes.SEND_LIMIT_ORDER);
export const cancelLimitOrder = createAction<CancelLimitOrder>(actionTypes.CANCEL_LIMIT_ORDER);
