import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}) => (
  <button
    className={`${styles.button} ${styles[variant]} ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? <span className={styles.loader}></span> : children}
  </button>
);

export default Button; 