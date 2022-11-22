import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Footer } from './Footer';
import { footerPropsMocked } from './Footer.mock';

export default {
  title: 'components/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => (
  <Footer {...args} />
);
export const Default = Template.bind({});

Default.args = footerPropsMocked;
