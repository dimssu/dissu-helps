import React from 'react';
import styles from './Form.module.scss';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  error?: string;
}

const Form: React.FC<FormProps> = ({ children, error, className = '', ...props }) => (
  <form className={`${styles.form} ${className}`} {...props}>
    {error && <div className={styles.error}>{error}</div>}
    {children}
  </form>
);

export default Form; 