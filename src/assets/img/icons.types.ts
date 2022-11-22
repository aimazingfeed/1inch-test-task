import { BaseSVGIconProps } from './components/BaseSVGIcon';

export type IconProps = Partial<
  Pick<BaseSVGIconProps, 'color' | 'htmlColor' | 'width' | 'height' | 'fill' | 'className'>
>;
