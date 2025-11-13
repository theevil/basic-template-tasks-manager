import React from 'react';
import './TextInput.scss';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="text-input-wrapper">
        {label && <label className="text-input-label">{label}</label>}
        <input
          ref={ref}
          className={`text-input ${error ? 'text-input--error' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-input-error">{error}</span>}
        {helperText && !error && <span className="text-input-helper">{helperText}</span>}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
