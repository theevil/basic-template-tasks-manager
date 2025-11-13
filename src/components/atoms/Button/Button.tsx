import React from 'react';
import './Button.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', className = '', ...props }, ref) => {
    const buttonClass = `btn btn--${variant} btn--${size} ${className}`;

    return (
      <button ref={ref} className={buttonClass} {...props} />
    );
  }
);

Button.displayName = 'Button';

export default Button;
