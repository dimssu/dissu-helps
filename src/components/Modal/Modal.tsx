import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import styles from './Modal.module.scss';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscapeKey?: boolean;
  hideCloseButton?: boolean;
  noPadding?: boolean;
  overlayClassName?: string;
  modalClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  closeClassName?: string;
  footerClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscapeKey = true,
  hideCloseButton = false,
  noPadding = false,
  overlayClassName,
  modalClassName,
  titleClassName,
  contentClassName,
  closeClassName,
  footerClassName,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 250); // Match animation duration
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && closeOnEscapeKey) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, closeOnEscapeKey]);

  if (!open && !isClosing) return null;

  const overlayAnimationClass = open ? styles.fadeIn : styles.fadeOut;
  const modalAnimationClass = open ? styles.zoomIn : styles.zoomOut;

  const modalContent = (
    <div
      className={clsx(styles.overlay, overlayClassName, overlayAnimationClass)}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className={clsx(
          styles.modal,
          styles[size!],
          { [styles.noPadding!]: noPadding },
          modalClassName,
          modalAnimationClass,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <div className={clsx(styles.title, titleClassName)}>{title}</div>}
        <div className={clsx(styles.content, contentClassName)}>{children}</div>
        {footer && <div className={clsx(styles.footer, footerClassName)}>{footer}</div>}
        {!hideCloseButton && (
          <button className={clsx(styles.close, closeClassName)} onClick={onClose}>
            &times;
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal; 