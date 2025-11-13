import React from 'react';
import { Checkbox, Button } from '../../atoms';
import './TaskItem.scss';

export interface TaskItemProps {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  description,
  isCompleted,
  onToggle,
  onDelete,
  isLoading = false,
}) => {
  return (
    <li className={`task-item ${isCompleted ? 'task-item--completed' : ''}`}>
      <div className="task-item__content">
        <Checkbox
          checked={isCompleted}
          onChange={() => onToggle(id)}
          disabled={isLoading}
        />
        <div className="task-item__text">
          <h3 className="task-item__title">{title}</h3>
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
