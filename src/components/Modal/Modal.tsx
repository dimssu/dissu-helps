import React from 'react';
import styles from './Modal.module.scss';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.content}>{children}</div>
        <button className={styles.close} onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

export default Modal; 