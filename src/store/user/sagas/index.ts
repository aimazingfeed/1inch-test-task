import { fork } from 'redux-saga/effects';

import cancelLimitOrder from './cancelLimitOrder';
import sendLimitOrder from './sendLimitOrder';

export default function* userSagas() {
  yield fork(sendLimitOrder);
  yield fork(cancelLimitOrder);
}
