import { fork } from 'redux-saga/effects';

import cancelAll from './cancelAll';
import cancelLimitOrder from './cancelLimitOrder';
import sendLimitOrder from './sendLimitOrder';

export default function* userSagas() {
  yield fork(sendLimitOrder);
  yield fork(cancelLimitOrder);
  yield fork(cancelAll);
}
