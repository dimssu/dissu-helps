import React, { useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import styles from './Toast.module.scss';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastTheme = 'glass' | 'dark';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface ToastProps {
  type?: ToastType;
  message: string;
  duration?: number; // ms
  onClose: () => void;
  theme?: ToastTheme;
  position?: ToastPosition;
}

const Toast: React.FC<ToastProps> = ({
  type = 'info',
  message,
  duration = 3000,
  onClose,
  theme = 'glass',
  position = 'top-right',
}) => {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<number | null>(null);

  const icons: { [key in ToastType]: React.ReactElement } = {
    success: <FiCheckCircle />,
    error: <FiXCircle />,
    info: <FiInfo />,
    warning: <FiAlertTriangle />,
  };

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

  const animation = position.includes('left')
    ? {
        in: styles['slide-in-left'],
        out: styles['slide-out-left'],
      }
    : {
        in: styles['slide-in-right'],
        out: styles['slide-out-right'],
      };

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${styles[theme]} ${visible ? animation.in : animation.out}`}
      role="alert"
    >
      <div className={styles.icon}>{icons[type]}</div>
      <span className={styles.message}>{message}</span>
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