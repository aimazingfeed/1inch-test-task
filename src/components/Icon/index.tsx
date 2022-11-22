import { FC } from 'react';
import cn from 'clsx';

import s from './Icon.module.scss';

interface IIconProps {
  icon: string;
  size: 'big' | 'small';
  className?: string;
}

export const Icon: FC<IIconProps> = ({ icon, size, className }) => {
  return <div className={cn(s.icon_wrapper, s[`${size}`], className)}>{icon !== '' && <img src={icon} alt="" />}</div>;
};
