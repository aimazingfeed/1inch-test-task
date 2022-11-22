import { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'components';
import { useShallowSelector } from 'hooks';
import { setActiveModal } from 'store/modals/reducer';
import modalsSelector from 'store/modals/selectors';
import { Modals, ModalsInitialState, State } from 'types';

import { ConnectWallet, DisconnectWallet } from './components';

import s from './styles.module.scss';

export interface NotificationModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConnectWallet: (provider: any) => void;
  onDisconnectWallet?: () => void;
}

export const NotificationModal: FC<NotificationModalProps> = ({ onConnectWallet, onDisconnectWallet }) => {
  const dispatch = useDispatch();
  const { modalState } = useShallowSelector<State, ModalsInitialState>(modalsSelector.getModals);
  const isConnectModal = modalState.activeModal === Modals.ConnectWallet;
  const isDisconnectModal = modalState.activeModal === Modals.DisconnectWallet;
  const closeModal = useCallback(() => {
    dispatch(
      setActiveModal({
        activeModal: Modals.init,
        txHash: '',
        open: false,
      }),
    );
  }, [dispatch]);
  return (
    <div>
      <Modal visible={modalState.open} onClose={closeModal} className={s.root}>
        {isConnectModal && <ConnectWallet connect={onConnectWallet} onClose={closeModal} />}
        {isDisconnectModal && <DisconnectWallet disconnect={onDisconnectWallet} onClose={closeModal} />}
      </Modal>
    </div>
  );
};
