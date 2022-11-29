import { FC, useEffect, useState } from 'react';
import { fromDecimals, toDecimals } from 'utils';

import s from './styles.module.scss';

interface OrderHistoryItemProps {
  getTokenDecimals?: (string) => Promise<number>;
  takerAsset?: string;
  makerAsset?: string;
  makingAmount?: string;
  takingAmount?: string;
}

export const OrderHistoryItem: FC<OrderHistoryItemProps> = ({
  getTokenDecimals,
  takerAsset,
  makerAsset,
  makingAmount,
  takingAmount,
}) => {
  const [makerTokenDecimals, setMakerTokenDecimals] = useState(0);
  const [takerTokenDecimals, setTakerTokenDecimals] = useState(0);
  useEffect(() => {
    let pageClosed = false;
    (async () => {
      if (!makerAsset || !takerAsset) return;
      const makerDecimals = getTokenDecimals && (await getTokenDecimals(makerAsset));
      const takerDecimals = getTokenDecimals && (await getTokenDecimals(takerAsset));
      if (pageClosed) return;
      setMakerTokenDecimals(makerDecimals);
      setTakerTokenDecimals(takerDecimals);
    })();
    return () => {
      pageClosed = true;
    };
  }, [getTokenDecimals, makerAsset, takerAsset]);
  return (
    <div className={s.itemContainer}>
      <p>{fromDecimals(makingAmount, makerTokenDecimals, true)}</p>
      <p>→</p>
      <p>{fromDecimals(takingAmount, takerTokenDecimals, true)}</p>
    </div>
  );
};
