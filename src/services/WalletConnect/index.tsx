/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { chains, networkDataForAddToMetamask } from 'config';
import { useShallowSelector } from 'hooks';
import { Subscription } from 'rxjs';
import { disconnectWalletState, updateUserState } from 'store/user/reducer';
import userSelector from 'store/user/selectors';
import { Chains, State, UserState, WalletProviders } from 'types';
import Web3 from 'web3';
import { provider as web3Provider } from 'web3-core';

import { WalletService } from '../WalletService';

interface IContextValue {
  connect: (provider: WalletProviders) => Promise<void>;
  disconnect: () => void;
  walletService: Web3;
}

interface WalletConnectContextProps {
  children: ReactNode;
}

const Web3Context = createContext({} as IContextValue);

const WalletConnectContext: FC<WalletConnectContextProps> = ({ children }) => {
  const [currentSubscriber, setCurrentSubscriber] = useState<Subscription>();
  const WalletConnect = useMemo(() => new WalletService(), []);
  const dispatch = useDispatch();
  const { provider: WalletProvider } = useShallowSelector<State, UserState>(userSelector.getUser);

  const disconnect = useCallback(() => {
    dispatch(disconnectWalletState());
    WalletConnect.resetConnect();
    currentSubscriber?.unsubscribe();
    setCurrentSubscriber(null);
    localStorage.removeItem('walletconnect');
  }, [WalletConnect, currentSubscriber, dispatch]);

  const subscriberSuccess = useCallback(
    (data: any) => {
      if (document.visibilityState !== 'visible') {
        disconnect();
      }

      // On MetaMask Accounts => Change / Disconnect / Connect
      if (data.name === 'accountsChanged') {
        disconnect();
      }
    },
    [disconnect],
  );

  const subscriberError = useCallback(
    (err: any) => {
      console.error(err);
      if (err.code === 4) {
        toast.error('You changed to wrong network. Please choose Binance Smart Chain');
        disconnect();
      }
    },
    [disconnect],
  );

  const connect = useCallback(
    async (provider: WalletProviders) => {
      const chain = Chains.polygon;
      try {
        const connected = await WalletConnect.initWalletConnect(provider, chain);
        if (connected) {
          try {
            const accountInfo: any = await WalletConnect.getAccount();
            if (accountInfo.network.chainID !== chains[Chains.polygon].chainId) {
              toast.error('You connected to wrong network. Please choose Binance Smart Chain');
              localStorage.removeItem('walletconnect');
              return;
            }
            if (accountInfo.address) {
              dispatch(updateUserState({ provider, address: accountInfo.address }));
            }
            if (!currentSubscriber) {
              const sub = WalletConnect.eventSubscribe().subscribe(subscriberSuccess, subscriberError);
              // @ts-ignore
              setCurrentSubscriber(sub);
            }
          } catch (error) {
            toast.error(error.message.text);

            // @ts-ignore
            if (!window.ethereum) {
              window.open(
                `https://metamask.app.link/dapp/${window.location.hostname + window.location.pathname}/?utm_source=mm`,
              );
              return;
            }
            // HOTFIX FOR OUR LIB, CHANGE LIB TYPES LATER
            if (error.code === 4) {
              // @ts-ignore
              window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [networkDataForAddToMetamask],
              });
            }
            // throw error; - // When decline wallet connect modal - throwing error
          }
        }
      } catch (err) {
        // console.error(err);
      }
    },
    [WalletConnect, currentSubscriber, dispatch, subscriberError, subscriberSuccess],
  );
  const web3WithoutMetamask = () => {
    const [first] = Object.values(chains.Polygon.provider.WalletConnect.provider.rpc.rpc);
    return new Web3(first as web3Provider);
  };

  useEffect(() => {
    if (WalletProvider && connect) {
      connect(WalletProvider as WalletProviders);
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        walletService: WalletConnect.Web3() || web3WithoutMetamask(),
      }}
    >
      {/* @ts-ignore */}
      {children}
    </Web3Context.Provider>
  );
};

const useWalletConnectorContext = () => useContext(Web3Context);

export { WalletConnectContext, useWalletConnectorContext };
