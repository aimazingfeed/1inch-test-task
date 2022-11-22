import { FC } from 'react';
import cn from 'clsx';

import s from './styles.module.scss';

export interface FooterProps {
  className?: string;
}

export const Footer: FC<FooterProps> = ({ className }) => {
  return <footer className={cn(s.footer, className)} />;
};
