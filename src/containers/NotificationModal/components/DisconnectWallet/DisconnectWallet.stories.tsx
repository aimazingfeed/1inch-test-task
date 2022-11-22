import { ComponentMeta, ComponentStory } from '@storybook/react';

import { DisconnectWallet } from './DisconnectWallet';
import { disconnectWalletPropsMocked } from './DisconnectWallet.mock';

export default {
  title: 'components/DisconnectWallet',
  component: DisconnectWallet,
} as ComponentMeta<typeof DisconnectWallet>;

const Template: ComponentStory<typeof DisconnectWallet> = (args) => (
  <DisconnectWallet {...args} />
);
export const Default = Template.bind({});

Default.args = disconnectWalletPropsMocked;
