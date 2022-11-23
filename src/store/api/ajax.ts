import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { isMainnet } from 'config/constants';
import { call, CallEffect, PutEffect, SelectEffect } from 'redux-saga/effects';
import { validateStatus } from 'utils';

const client: AxiosInstance = axios.create({
  baseURL: isMainnet ? 'https://limit-orders.1inch.io' : '',
  validateStatus,
});

export default function* ajax(config: AxiosRequestConfig): Generator<SelectEffect | CallEffect | PutEffect> {
  // @ts-ignore
  const response: AxiosResponse<ApiResponse<unknown>> = yield call<(configVar: AxiosRequestConfig) => void>(
    client,
    config,
  );

  return response;
}
