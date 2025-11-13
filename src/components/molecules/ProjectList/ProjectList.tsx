import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../../../store/slices/projectSlice';
import { fetchTasks } from '../../../store/slices/taskSlice';
import type { ProjectCreate, ProjectUpdate } from '../../../types';
import './ProjectList.scss';

interface ProjectListProps {
  onSelectProject: (projectId: string) => void;
  selectedProjectId: string | null;
}

const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject, selectedProjectId }) => {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch projects on mount
  useEffect(() => {
    dispatch(fetchProjects({ skip: 0, limit: 100 }));
  }, [dispatch]);

  // Handle creating a new project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const projectData: ProjectCreate = {
      name: name.trim(),
      description: description.trim() || undefined,
    };

    try {
      await dispatch(createProject(projectData)).unwrap();
      setName('');
      setDescription('');
      setShowForm(false);
      console.log('Project created successfully');
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  // Handle updating a project
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !editingId) return;

    const updateData: ProjectUpdate = {
      name: name.trim(),
      description: description.trim() || undefined,
    };

    try {
      await dispatch(updateProject({ projectId: editingId, data: updateData })).unwrap();
      setName('');
      setDescription('');
      setEditingId(null);
      setShowForm(false);
      console.log('Project updated successfully');
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  // Handle deleting a project
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await dispatch(deleteProject(projectId)).unwrap();
      if (selectedProjectId === projectId) {
        onSelectProject('');
      }
      console.log('Project deleted successfully');
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  // Handle selecting a project
  const handleSelectProject = (projectId: string) => {
    onSelectProject(projectId);
    // Fetch tasks for this project when selected
    dispatch(fetchTasks({ skip: 0, limit: 100 }));
  };

  // Handle edit project
  const handleEditProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setEditingId(projectId);
      setName(project.name);
      setDescription(project.description || '');
      setShowForm(true);
    }
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setDescription('');
  };

  return (
    <div className="project-list">
      <div className="project-list__header">
        <h2>Projects</h2>
        <button
          className="project-list__add-btn"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {error && <div className="project-list__error">{error}</div>}

      {showForm && (
        <form
          className="project-list__form"
          onSubmit={editingId ? handleUpdateProject : handleCreateProject}
        >
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <textarea
            placeholder="Project description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            disabled={loading}
          />
          <div className="project-list__form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
            </button>
            <button type="button" onClick={handleCancelForm} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && projects.length === 0 && (
        <div className="project-list__loading">Loading projects...</div>
      )}

      {projects.length === 0 && !loading && !showForm && (
        <div className="project-list__empty">
          <p>No projects yet. Create your first project to get started!</p>
        </div>
      )}

      <ul className="project-list__items">
        {projects.map((project) => (
          <li
            key={project.id}
            className={`project-list__item ${
              selectedProjectId === project.id ? 'project-list__item--selected' : ''
            }`}
          >
            <div
              className="project-list__item-content"
              onClick={() => handleSelectProject(project.id)}
            >
              <div className="project-list__item-header">
                <h3>{project.name}</h3>
              </div>
              {project.description && (
                <p className="project-list__item-description">{project.description}</p>
              )}
              <span className="project-list__item-date">
                Created: {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="project-list__item-actions">
              <button
                className="project-list__item-btn project-list__item-btn--edit"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditProject(project.id);
                }}
                disabled={loading}
                title="Edit"
              >
                ✏️
              </button>
              <button
                className="project-list__item-btn project-list__item-btn--delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
                disabled={loading}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
