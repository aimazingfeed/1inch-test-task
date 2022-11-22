import userActionTypes from 'store/user/actionTypes';
import { UIState } from 'types';
import { RequestStatus } from 'types/store';

import { getUIReducer } from '.';

const initialState: UIState = {
  [userActionTypes.SEND_LIMIT_ORDER]: RequestStatus.INIT,
  [userActionTypes.CANCEL_LIMIT_ORDER]: RequestStatus.INIT,
};

const uiReducer = getUIReducer(initialState);

export default uiReducer;
