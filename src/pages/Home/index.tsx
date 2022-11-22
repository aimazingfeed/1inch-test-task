import { FC } from 'react';
import cn from 'clsx';
import { LimitOrder } from 'forms';

import s from './styles.module.scss';

interface HomeProps {
  className?: string;
}

const Home: FC<HomeProps> = ({ className }) => {
  return (
    <div className={cn(className, s.home)}>
      <LimitOrder />
    </div>
  );
};

export default Home;
