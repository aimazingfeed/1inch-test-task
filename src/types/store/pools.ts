/* eslint-disable camelcase */
export type PoolsState = {
  pools: PoolDataItemModel[];
};

export type PoolDataItemModel = {
  poolName: string;
  poolAddress: string;
  earned: string;
  balance: string;
  userStakeAmount: string;
  isVisible: boolean;
  minStakingTime: string;
  startTime: string;
  endTime: string;
  totalStaked: string;
  RPS: string;
  apr: string;
  status: 'UNKNOWN' | 'COMING_SOON' | 'IN_PROCESS' | 'COMPLETED';
  unstakePenalty: string;
  description: string;
  rewardTokenData: TokenData;
  stakingTokenData: TokenData;
};

export interface TokenData {
  tokenAddress: string;
  tokenIcon: string;
  tokenSymbol: string;
  tokenDecimals: string;
}
export type PoolDataResponseItem = {
  name: string;
  address: string;
  is_visible: boolean;
  staking_token_address: string;
  staking_token_image: string;
  reward_token_address: string;
  reward_token_image: string;
  min_staking_time: string;
  start_time: string;
  end_time: string;
  update_time: string;
  apr: string;
  total_staked: string;
  reward_per_second: string;
  status: 'UNKNOWN' | 'COMING_SOON' | 'IN_PROCESS' | 'COMPLETED';
  early_unstake_penalty: string;
  description: string;
};
