import { FC } from 'react';
import cn from 'clsx';

import s from './styles.module.scss';

export interface DisconnectWalletProps {
  className?: string;
  disconnect?: () => void;
  onClose?: () => void;
}

export const DisconnectWallet: FC<DisconnectWalletProps> = ({ className, disconnect, onClose }) => {
  const handleDisconnectClick = () => {
    onClose();
    disconnect();
  };
  return (
    <div className={cn(s.disconnectWallet, className)}>
      <p className={s.modalText}>Disable your wallet?</p>
      <button type="button" className={s.disconnectButton} onClick={handleDisconnectClick}>
        Disconnect
      </button>
    </div>
  );
};
