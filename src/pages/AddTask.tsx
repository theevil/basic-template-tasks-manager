import { useState } from 'react';
import './AddTask.scss';

interface AddTaskProps {
  onAddTask: (title: string, description?: string) => void;
}

export default function AddTask({ onAddTask }: AddTaskProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [showDescription, setShowDescription] = useState<boolean>(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title, description || undefined);
      setTitle('');
      setDescription('');
      setShowDescription(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      {showDescription && (
        <textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      )}
      
      <div className="form-button-group">
        <button 
          type="button" 
          onClick={() => setShowDescription(!showDescription)}
        >
          {showDescription ? 'Hide' : 'Add'} Description
        </button>
        
        <button type="submit">Add Task</button>
      </div>
    </form>
  );
}
