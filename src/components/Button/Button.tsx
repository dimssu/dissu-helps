import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loaderClassName?: string;
  startIconClassName?: string;
  endIconClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  className,
  loaderClassName,
  startIconClassName,
  endIconClassName,
  ...props
}) => (
  <button
    className={clsx(
      styles.button,
      styles[variant!],
      styles[size!],
      { [styles.fullWidth!]: fullWidth, [styles.loading!]: loading },
      className,
    )}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && <span className={clsx(styles.loader, loaderClassName)} />}
    {!loading && startIcon && <span className={clsx(styles.icon, styles.startIcon, startIconClassName)}>{startIcon}</span>}
    <span className={styles.content}>{children}</span>
    {!loading && endIcon && <span className={clsx(styles.icon, styles.endIcon, endIconClassName)}>{endIcon}</span>}
  </button>
);

export default Button; 