import React, { useState } from 'react';
import { Button, TextInput } from '../../atoms';
import PrioritySelector from '../../atoms/PrioritySelector/PrioritySelector';
import type { Priority } from '../../atoms/PrioritySelector/PrioritySelector';
import './AddTaskForm.scss';

export interface AddTaskFormProps {
  onAddTask: (title: string, description?: string, priority?: Priority) => void;
  isLoading?: boolean;
  defaultPriority?: Priority;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onAddTask,
  isLoading = false,
  defaultPriority = 'Normal'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    onAddTask(title.trim(), description.trim() || undefined, priority);
    setTitle('');
    setDescription('');
    setPriority(defaultPriority);
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <div className="add-task-form__fields">
        <TextInput
          label="Task Title"
          placeholder="Enter task title..."
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          error={error}
          disabled={isLoading}
        />
        <TextInput
          label="Description (Optional)"
          placeholder="Enter task description..."
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          disabled={isLoading}
        />
        <PrioritySelector
          value={priority}
          onChange={setPriority}
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="medium"
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Task'}
      </Button>
    </form>
  );
};

export default AddTaskForm;
