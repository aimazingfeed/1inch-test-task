import { ComponentType, FC, ReactNode } from 'react';
import forEach from 'lodash/forEach';

import { IconProps } from './icons.types';
import * as allIcons from '.';

export default {
  title: 'theme/Icons',
};

interface IconVariantsProps {
  Icon: ComponentType<IconProps>;
}

const IconVariants: FC<IconVariantsProps> = ({ Icon }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <p>{Icon.displayName}</p>
      <div
        style={{
          display: 'flex',
          border: '1px solid lightgray',
          margin: 10,
          textAlign: 'center',
          padding: 5,
        }}
      >
        <Icon />
        <div>
          <Icon />
        </div>
      </div>
    </div>
  );
};

export const Icons: FC = () => {
  const content: ReactNode[] = [];
  forEach(allIcons, (icon, index) => {
    content.push(<IconVariants key={index} Icon={icon} />);
  });
  return <div>{content}</div>;
};
