import './TaskList.scss';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onChangeTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask,
}: TaskListProps) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          <label>
            <input
              type="checkbox"
              checked={task.is_completed}
              onChange={(e) => {
                onChangeTask({
                  ...task,
                  is_completed: e.target.checked,
                });
              }}
            />
            <span className={task.is_completed ? 'task-done' : ''}>
              {task.title}
            </span>
          </label>
          <button onClick={() => onDeleteTask(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
