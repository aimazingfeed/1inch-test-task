import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ConnectWallet } from './ConnectWallet';
import { connectWalletPropsMocked } from './ConnectWallet.mock';

export default {
  title: 'components/ConnectWallet',
  component: ConnectWallet,
} as ComponentMeta<typeof ConnectWallet>;

const Template: ComponentStory<typeof ConnectWallet> = (args) => (
  <ConnectWallet {...args} />
);
export const Default = Template.bind({});

Default.args = connectWalletPropsMocked;
