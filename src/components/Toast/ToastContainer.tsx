import React from 'react';
import Toast from './Toast';
import type { ToastType, ToastTheme, ToastPosition } from './Toast';
import styles from './Toast.module.scss';

export type { ToastPosition };

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  theme?: ToastTheme;
}

interface ToastContainerProps {
  position?: ToastPosition;
  theme?: ToastTheme;
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'top-right', theme = 'glass', toasts, onRemove }) => {
  return (
    <div className={`${styles['toast-container']} ${styles[position]}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
          theme={toast.theme || theme}
          position={position}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 