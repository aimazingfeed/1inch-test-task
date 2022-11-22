import { render } from '@testing-library/react';

import { Footer } from './Footer';
import { footerPropsMocked } from './Footer.mock';

describe('Footer', () => {
  it('should render', () => {
    const { container } = render(<Footer {...footerPropsMocked} />);
    expect(container).toMatchSnapshot();
  });
});
