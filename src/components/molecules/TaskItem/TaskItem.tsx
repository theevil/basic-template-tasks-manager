import React from 'react';
import { Checkbox, Button } from '../../atoms';
import type { Priority } from '../../atoms/PrioritySelector/PrioritySelector';
import './TaskItem.scss';

export interface TaskItemProps {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const getPriorityColor = (priority?: Priority): string => {
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

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  description,
  priority,
  isCompleted,
  onToggle,
  onDelete,
  isLoading = false,
}) => {
  return (
    <li 
      className={`task-item ${isCompleted ? 'task-item--completed' : ''}`}
      data-priority={priority || 'Normal'}
    >
      <div className="task-item__content">
        <Checkbox
          checked={isCompleted}
          onChange={() => onToggle(id)}
          disabled={isLoading}
        />
        <div className="task-item__text">
          <div className="task-item__header">
            <h3 className="task-item__title">{title}</h3>
            {priority && (
              <span 
                className="task-item__priority"
                style={{
                  backgroundColor: getPriorityColor(priority),
                  color: ['Top', 'High', 'Medium'].includes(priority) ? 'white' : 'inherit'
                }}
              >
                {priority}
              </span>
            )}
          </div>
          {description && <p className="task-item__description">{description}</p>}
        </div>
      </div>
      <Button
        variant="danger"
        size="small"
        onClick={() => onDelete(id)}
        disabled={isLoading}
      >
        Delete
      </Button>
    </li>
  );
};

export default TaskItem;
