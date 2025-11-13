import React from 'react';
import './PrioritySelector.scss';

export type Priority = 'Normal' | 'Low' | 'Medium' | 'High' | 'Top';

interface PrioritySelectorProps {
  value?: Priority;
  onChange: (priority: Priority) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const priorityOptions = [
  { value: 'Normal' as const, label: 'Normal' },
  { value: 'Low' as const, label: 'Low' },
  { value: 'Medium' as const, label: 'Medium' },
  { value: 'High' as const, label: 'High' },
  { value: 'Top' as const, label: 'Top' },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Top':
      return '#ff4d4f';
    case 'High':
      return '#ff7a45';
    case 'Medium':
      return '#faad14';
    case 'Low':
      return '#52c41a';
    default:
      return '#d9d9d9';
  }
};

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  value = 'Normal',
  onChange,
  disabled = false,
  className = '',
  label = 'Priority',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as Priority);
  };

  return (
    <div className={`priority-selector ${className}`}>
      {label && <label className="priority-selector__label">{label}</label>}
      <div className="priority-selector__select-wrapper">
        <select
          className="priority-selector__select"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          style={{
            borderLeftColor: getPriorityColor(value),
            borderLeftWidth: '4px',
            borderLeftStyle: 'solid',
            color: value ? '#333333' : '#666666',
          }}
        >
          <option value="" disabled hidden>
            Select priority...
          </option>
          {priorityOptions.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className={`priority-selector__option priority-selector__option--${option.value.toLowerCase()}`}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="priority-selector__arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PrioritySelector;
