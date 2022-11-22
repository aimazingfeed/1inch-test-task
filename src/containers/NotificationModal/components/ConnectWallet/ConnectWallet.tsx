import { FC } from 'react';
import { MetamaskLogo } from 'assets/img';
import cn from 'clsx';
import { WalletProviders } from 'types';

import s from './styles.module.scss';

export interface ConnectWalletProps {
  className?: string;
  connect?: (provider: WalletProviders) => void;
  onClose?: () => void;
}

export const ConnectWallet: FC<ConnectWalletProps> = ({ className, connect, onClose }) => {
  const handleConnectClick = (provider: WalletProviders) => {
    connect(provider);
    onClose();
  };
  return (
    <div className={cn(s.connectWallet, className)}>
      <div className={s.modalHeader}>
        <p>Connect a Wallet</p>
      </div>
      <p className={s.bodyText}>Please select a wallet to connect to this dapp:</p>
      <div className={s.buttonsContainer}>
        <button
          className={cn(s.metamaskButton, s.connectButton)}
          type="button"
          onClick={() => handleConnectClick(WalletProviders.metamask)}
        >
          <MetamaskLogo />
        </button>
      </div>
    </div>
  );
};
