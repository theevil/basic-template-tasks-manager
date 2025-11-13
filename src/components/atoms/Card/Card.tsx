import React from 'react';
import './Card.scss';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ elevation = 'medium', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card card--${elevation} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
