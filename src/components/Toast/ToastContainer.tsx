import React from 'react';
import Toast from './Toast';
import type { ToastType } from './Toast';
import styles from './Toast.module.scss';

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  theme?: 'dark' | 'primary' | 'secondary';
}

interface ToastContainerProps {
  position?: ToastPosition;
  theme?: 'dark' | 'primary' | 'secondary';
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'top-right', theme = 'dark', toasts, onRemove }) => {
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
        />
      ))}
    </div>
  );
};

export default ToastContainer; 