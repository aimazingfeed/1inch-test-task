import { fork } from 'redux-saga/effects';

import getUserBalance from './getUserBalance';
import sendLimitOrder from './sendLimitOrder';

export default function* userSagas() {
  yield fork(getUserBalance);
  yield fork(sendLimitOrder);
}
