import { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'clsx';
import { useShallowSelector } from 'hooks';
import { setActiveModal } from 'store/modals/reducer';
import userSelector from 'store/user/selectors';
import { Modals, State, UserState } from 'types';
import { shortenPhrase } from 'utils';

import s from './Header.module.scss';

interface HeaderProps {
  className?: string;
}

export const Header: FC<HeaderProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { address } = useShallowSelector<State, UserState>(userSelector.getUser);
  const connectButtonContent = address ? shortenPhrase(address, 5, 6) : 'Connect wallet';

  const openModal = useCallback(
    (type: Modals) => {
      dispatch(
        setActiveModal({
          activeModal: type,
          txHash: '',
          open: true,
        }),
      );
    },
    [dispatch],
  );
  const handleConnectButtonClick = () => {
    if (!address) openModal(Modals.ConnectWallet);
    else openModal(Modals.DisconnectWallet);
  };
  return (
    <div className={cn(s.headerWrapper, className)}>
      <button type="button" className={s.connectButton} onClick={handleConnectButtonClick}>
        {connectButtonContent}
      </button>
    </div>
  );
};
