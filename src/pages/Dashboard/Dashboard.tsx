import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../store/slices/taskSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import { MainLayout } from '../../components/templates';
import { TaskList } from '../../components/organisms';
import { AddTaskForm, ProjectList } from '../../components/molecules';
import type { TaskCreate, TaskUpdate } from '../../types';
import type { Priority } from '../../components/atoms/PrioritySelector/PrioritySelector';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading: tasksLoading, error: tasksError } = useAppSelector(
    (state) => state.tasks
  );
  const { projects, error: projectsError } = useAppSelector(
    (state) => state.projects
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchProjects({ skip: 0, limit: 100 }));
  }, [dispatch]);

  // Fetch tasks when a project is selected
  useEffect(() => {
    if (selectedProjectId) {
      dispatch(fetchTasks({ skip: 0, limit: 100 }));
    }
  }, [selectedProjectId, dispatch]);

  // Handle adding a new task to the selected project
  const handleAddTask = async (title: string, description?: string, priority: Priority = 'Normal') => {
    if (!selectedProjectId) {
      alert('Please select a project first');
      return;
    }

    const taskData: TaskCreate = {
      title,
      description,
      priority,
      is_completed: false,
      project_id: selectedProjectId,
    };

    try {
      await dispatch(createTask(taskData)).unwrap();
      console.log('Task created successfully');
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  // Handle toggling task completion status
  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updateData: TaskUpdate = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        is_completed: !task.is_completed,
      };

      try {
        await dispatch(updateTask({ taskId: id, data: updateData })).unwrap();
        console.log('Task updated successfully');
      } catch (err) {
        console.error('Failed to update task:', err);
      }
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (id: string) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      console.log('Task deleted successfully');
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Convert tasks to the format expected by TaskList component
  const formattedTasks = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    priority: task.priority as Priority,
    isCompleted: task.is_completed,
  }));

  // Get the selected project details
  const currentProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <MainLayout title="Task Manager">
      <div className="dashboard">
        <div className="dashboard__grid">
          {/* Projects Section */}
          <section className="dashboard__section dashboard__section--projects">
            <ProjectList
              onSelectProject={setSelectedProjectId}
              selectedProjectId={selectedProjectId}
            />
          </section>

          {/* Tasks Section */}
          <section className="dashboard__section dashboard__section--tasks">
            {selectedProjectId ? (
              <>
                <div className="dashboard__tasks-header">
                  <h2>
                    {currentProject ? `${currentProject.name} - Tasks` : 'Project Tasks'}
                  </h2>
                  {currentProject && currentProject.description && (
                    <p className="dashboard__project-description">{currentProject.description}</p>
                  )}
                </div>

                {tasksError && <div className="dashboard__error">{tasksError}</div>}
                {projectsError && <div className="dashboard__error">{projectsError}</div>}

                <AddTaskForm onAddTask={handleAddTask} isLoading={tasksLoading} />

                <TaskList
                  tasks={formattedTasks}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  isLoading={tasksLoading}
                />
              </>
            ) : (
              <div className="dashboard__no-project">
                <div className="dashboard__no-project-content">
                  <h2>No Project Selected</h2>
                  <p>Please select or create a project from the list on the left to start managing tasks.</p>
                  <ul className="dashboard__no-project-steps">
                    <li>1. Click "+ New Project" to create a new project</li>
                    <li>2. Click on a project to select it</li>
                    <li>3. Add tasks to the selected project</li>
                  </ul>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
