import { AbiItem } from 'web3-utils';

import bep20AbiJSON from './bep20.abi.json';
import swapAbiJSON from './swap.abi.json';

export const swapAbi = swapAbiJSON as AbiItem[];
export const bep20Abi = bep20AbiJSON as AbiItem[];
