import React, { useEffect } from 'react';
import styles from './Toast.module.scss';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type?: ToastType;
  message: string;
  duration?: number; // ms
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type = 'info', message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>{message}</div>
  );
};

export default Toast; 