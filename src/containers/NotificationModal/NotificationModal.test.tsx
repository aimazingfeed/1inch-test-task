import { render } from '@testing-library/react';

import { NotificationModal } from './NotificationModal';
import { notificationModalPropsMocked } from './NotificationModal.mock';

describe('NotificationModal', () => {
  it('should render', () => {
    const { container } = render(<NotificationModal {...notificationModalPropsMocked} />);
    expect(container).toMatchSnapshot();
  });
});
