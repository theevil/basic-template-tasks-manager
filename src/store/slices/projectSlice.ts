import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import type { Project, ProjectCreate, ProjectUpdate } from '../../types';

// ============================================
// State Interface
// ============================================
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

// ============================================
// Async Thunks
// ============================================

/**
 * Fetch all projects
 * GET /projects
 */
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (
    { skip = 0, limit = 100 }: { skip?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get<Project[]>('/projects/', {
        params: { skip, limit },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch projects');
    }
  }
);

/**
 * Fetch single project by ID
 * GET /projects/{project_id}
 */
export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Project>(`/projects/${projectId}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch project');
    }
  }
);

/**
 * Create new project
 * POST /projects
 */
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData: ProjectCreate, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Project>('/projects/', projectData);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create project');
    }
  }
);

/**
 * Update project
 * PUT /projects/{project_id}
 */
export const updateProject = createAsyncThunk(
  'projects/update',
  async (
    { projectId, data }: { projectId: string; data: ProjectUpdate },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put<Project>(
        `/projects/${projectId}`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update project');
    }
  }
);

/**
 * Delete project
 * DELETE /projects/{project_id}
 */
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (projectId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/projects/${projectId}`);
      return projectId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete project');
    }
  }
);

// ============================================
// Slice
// ============================================

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.error = null;
    },
    clearProjects: (state) => {
      state.projects = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============ FETCH ALL PROJECTS ============
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.loading = false;
          state.projects = action.payload;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH PROJECT BY ID ============
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectById.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.loading = false;
          state.currentProject = action.payload;
        }
      )
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ CREATE PROJECT ============
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.loading = false;
          state.projects.push(action.payload);
          state.currentProject = action.payload;
        }
      )
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ UPDATE PROJECT ============
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.loading = false;
          const index = state.projects.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
          if (state.currentProject?.id === action.payload.id) {
            state.currentProject = action.payload;
          }
        }
      )
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ DELETE PROJECT ============
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.projects = state.projects.filter((p) => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProject, clearProjects, clearError } =
  projectSlice.actions;

export default projectSlice.reducer;
