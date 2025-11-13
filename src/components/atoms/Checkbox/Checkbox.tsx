import React from 'react';
import './Checkbox.scss';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`checkbox-wrapper ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className="checkbox-input"
          {...props}
        />
        <span className="checkbox-custom"></span>
        {label && <span className="checkbox-label">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
