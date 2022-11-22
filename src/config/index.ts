/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chains, IConnectWallet, IContracts } from 'types';

import { SwapAbi } from './abi';
import { explorerUrl, isMainnet } from './constants';

export const chains: {
  [key: string]: {
    name: string;
    chainId: number;
    provider: {
      [key: string]: any;
    };
    img?: any;
  };
} = {
  Polygon: {
    name: isMainnet ? 'Polygon' : 'Mumbai Testnet',
    chainId: isMainnet ? 137 : 80001,
    provider: {
      MetaMask: { name: 'MetaMask' },
      WalletConnect: {
        name: 'WalletConnect',
        useProvider: 'rpc',
        provider: {
          rpc: {
            rpc: {
              [isMainnet ? 137 : 80001]: isMainnet ? 'https://polygon-rpc.com' : 'https://rpc-mumbai.maticvigil.com',
            },
            chainId: isMainnet ? 137 : 80001,
          },
        },
      },
    },
  },
};

export const connectWallet = (newChainName: Chains): IConnectWallet => {
  const chain = chains[newChainName];
  return {
    network: {
      chainName: chain.name,
      chainID: chain.chainId,
    },
    provider: chain.provider,
    settings: { providerType: true },
  };
};

export enum ContractsNames {
  swap = 'swap',
}

export type IContractsNames = keyof typeof ContractsNames;

export const contractsConfig: IContracts = {
  names: Object.keys(ContractsNames),
  decimals: 18,
  contracts: {
    [ContractsNames.swap]: {
      address: {
        [Chains.polygon]: isMainnet ? '0x94Bc2a1C732BcAd7343B25af48385Fe76E08734f' : '',
      },
      abi: SwapAbi,
    },
  },
};

export const networkDataForAddToMetamask = {
  chainID: isMainnet ? 137 : 80001,
  chainName: isMainnet ? 'Polygon' : 'Mumbai Testnet',
  rpcUrls: isMainnet ? 'https://polygon-rpc.com' : 'https://rpc-mumbai.maticvigil.com',
  blockExplorerUrls: explorerUrl,
};
