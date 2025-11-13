import React from 'react';
import { Card } from '../../atoms';
import { TaskItem } from '../../molecules';
import './TaskList.scss';

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
}

export interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  isLoading = false,
  emptyMessage = 'No tasks yet. Create your first task!',
}) => {
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;

  return (
    <div className="task-list">
      <div className="task-list__header">
        <h2 className="task-list__title">Tasks</h2>
        <p className="task-list__stats">
          {completedCount} of {totalCount} completed
        </p>
      </div>

      {tasks.length === 0 ? (
        <Card className="task-list__empty">
          <p>{emptyMessage}</p>
        </Card>
      ) : (
        <ul className="task-list__items">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              isCompleted={task.isCompleted}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              isLoading={isLoading}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
