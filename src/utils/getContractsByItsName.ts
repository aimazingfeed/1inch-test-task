import { contractsConfig, ContractsNames } from 'config';
import { Chains } from 'types';
import { AbiItem } from 'web3-utils';

export const getContractDataByItsName = (name: ContractsNames, network = Chains.polygon): [AbiItem[], string] => {
  const { abi: contractAbi, address: contractAddress } = contractsConfig.contracts[name];
  return [contractAbi as AbiItem[], contractAddress[network]];
};
