import React from 'react';
import { render } from '@testing-library/react';

import { StarIcon } from './components/StarIcon';

describe('Icons', () => {
  it('should render', () => {
    const { container } = render(<StarIcon />);
    expect(container).toMatchSnapshot();
  });
});
