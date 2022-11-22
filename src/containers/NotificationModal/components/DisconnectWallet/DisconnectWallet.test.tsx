import { render } from '@testing-library/react';

import { DisconnectWallet } from './DisconnectWallet';
import { disconnectWalletPropsMocked } from './DisconnectWallet.mock';

describe('DisconnectWallet', () => {
  it('should render', () => {
    const { container } = render(
      <DisconnectWallet
        {...disconnectWalletPropsMocked}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
