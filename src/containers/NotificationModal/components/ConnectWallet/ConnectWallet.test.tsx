import { render } from '@testing-library/react';

import { ConnectWallet } from './ConnectWallet';
import { connectWalletPropsMocked } from './ConnectWallet.mock';

describe('ConnectWallet', () => {
  it('should render', () => {
    const { container } = render(
      <ConnectWallet
        {...connectWalletPropsMocked}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
