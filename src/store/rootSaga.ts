import { fork } from 'redux-saga/effects';
import userSaga from 'store/user/sagas';
/* PLOP_INJECT_IMPORT_SAGA */

export default function* rootSaga() {
  yield fork(userSaga);
  /* PLOP_INJECT_FORK_SAGA */
}
