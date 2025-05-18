import React, { useEffect, useRef, useState } from 'react';
import styles from './Toast.module.scss';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type?: ToastType;
  message: string;
  duration?: number; // ms
  onClose: () => void;
  theme?: 'dark' | 'primary' | 'secondary';
}

const Toast: React.FC<ToastProps> = ({ type = 'info', message, duration = 3000, onClose, theme = 'dark' }) => {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => setVisible(false), duration);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration]);

  useEffect(() => {
    if (!visible) {
      const timeout = window.setTimeout(onClose, 300); // match fade-out duration
      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [visible, onClose]);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${styles[theme]} ${visible ? styles['fade-in'] : styles['fade-out']}`}
      role="alert"
    >
      <span>{message}</span>
      <button className={styles.close} onClick={() => setVisible(false)} aria-label="Close toast">&times;</button>
      <div
        className={styles.progress}
        style={{
          animation: visible ? `${styles.progressBar} ${duration}ms linear forwards` : 'none',
        }}
      />
    </div>
  );
};

export default Toast; 