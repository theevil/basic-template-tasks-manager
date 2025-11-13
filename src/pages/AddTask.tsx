import { useState } from 'react';

interface AddTaskProps {
  onAddTask: (text: string) => void;
}

export default function AddTask({ onAddTask }: AddTaskProps) {
  const [input, setInput] = useState<string>('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.trim()) {
      onAddTask(input);
      setInput('');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}
