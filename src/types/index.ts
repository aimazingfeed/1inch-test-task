export * from './connect';
export * from './store';

export type TNullable<T> = T | null;
export type TOptionable<T> = T | undefined;

export enum WalletProviders {
  metamask = 'MetaMask',
  walletConnect = 'WalletConnect',
}
