import { FC, ReactNode, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer, Header, NotificationModal } from 'containers';
import { useSmoothTopScroll } from 'hooks';
import { useWalletConnectorContext } from 'services';

import s from './styles.module.scss';

export interface LayoutProps {
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { connect, disconnect } = useWalletConnectorContext();

  const firstPathAtPathname = useMemo(() => pathname.split('/')[1], [pathname]);
  useSmoothTopScroll(firstPathAtPathname);

  const handleConnectWallet = useCallback(
    async (provider) => {
      connect(provider);
    },
    [connect],
  );

  const disconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return (
    <div className={s.wrapper}>
      <NotificationModal onConnectWallet={handleConnectWallet} onDisconnectWallet={disconnectWallet} />
      <Header className={s.header} />
      <main className={s.mainContainer}>{children}</main>
      <Footer className={s.footer} />
    </div>
  );
};
