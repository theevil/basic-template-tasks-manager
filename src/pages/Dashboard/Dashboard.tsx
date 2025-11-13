import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  addLocalTask,
  toggleLocalTask,
  deleteLocalTask,
  fetchTasks,
} from '../../store/slices/taskSlice';
import { MainLayout } from '../../components/templates';
import { TaskList } from '../../components/organisms';
import { AddTaskForm } from '../../components/molecules';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    // Try to fetch from API on mount, but this won't fail if backend is not available
    dispatch(fetchTasks({ skip: 0, limit: 100 })).catch(() => {
      // API not available, will use local state management
    });
  }, [dispatch]);

  const handleAddTask = (title: string, description?: string) => {
    dispatch(addLocalTask({ title, description }));
  };

  const handleToggleTask = (id: string) => {
    dispatch(toggleLocalTask(id));
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteLocalTask(id));
  };

  // Convert tasks to the format expected by TaskList component
  const formattedTasks = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    isCompleted: task.is_completed,
  }));

  return (
    <MainLayout title="Task Manager">
      <div className="dashboard">
        <div className="dashboard__grid">
          <section className="dashboard__section">
            <AddTaskForm onAddTask={handleAddTask} isLoading={loading} />
          </section>

          <section className="dashboard__section">
            {error && <div className="dashboard__error">{error}</div>}
            <TaskList
              tasks={formattedTasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              isLoading={loading}
            />
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
