import { noop } from 'rxjs';

import { ModalProps } from './Modal';

export const modalPropsMocked: ModalProps = {
  visible: true,
  onClose: noop,
};
