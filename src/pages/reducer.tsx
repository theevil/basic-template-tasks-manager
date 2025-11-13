import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';
import AddTask from './AddTask';
import TaskList from './TaskList';
import type { Task, TaskCreate, TaskUpdate } from '../types';

export default function TaskApp() {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  // Fetch all tasks when component mounts
  useEffect(() => {
    dispatch(fetchTasks({ skip: 0, limit: 100 }));
  }, [dispatch]);

  // Handle adding a new task
  const handleAddTask = async (title: string, description?: string): Promise<void> => {
    // Use a default project ID for now, or get it from props/context
    const projectId = 'default-project-id'; // TODO: Replace with actual project ID

    const taskData: TaskCreate = {
      title,
      description,
      priority: 'Normal',
      is_completed: false,
      project_id: projectId,
    };

    try {
      await dispatch(createTask(taskData));
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  // Handle task state changes (marking complete/incomplete)
  const handleChangeTask = async (task: Task): Promise<void> => {
    const updateData: TaskUpdate = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      is_completed: task.is_completed,
    };

    try {
      await dispatch(updateTask({ taskId: task.id, data: updateData }));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string): Promise<void> => {
    try {
      await dispatch(deleteTask(taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <>
      <h1>Prague itinerary</h1>
      
      {error && <div className="error-message">Error: {error}</div>}
      {loading && <div className="loading-message">Loading tasks...</div>}
      
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}
