import './TaskList.scss';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onChangeTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
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
              checked={task.done}
              onChange={(e) => {
                onChangeTask({
                  ...task,
                  done: e.target.checked,
                });
              }}
            />
            <span className={task.done ? 'task-done' : ''}>
              {task.text}
            </span>
          </label>
          <button onClick={() => onDeleteTask(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
