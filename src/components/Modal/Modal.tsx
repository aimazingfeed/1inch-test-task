import { FC, PropsWithChildren } from 'react';
import cn from 'clsx';
import Dialog from 'rc-dialog';

import s from './styles.module.scss';

export interface ModalProps {
  className?: string;
  visible: boolean;
  onClose: () => void;
}
export const Modal: FC<PropsWithChildren<ModalProps>> = ({ className, visible, onClose, children }) => {
  return (
    <Dialog
      prefixCls="modal"
      zIndex={1000}
      destroyOnClose
      className={cn(s.modal_wrapper, className)}
      closable={false}
      visible={visible}
      maskClosable
      onClose={onClose}
    >
      {children}
    </Dialog>
  );
};
