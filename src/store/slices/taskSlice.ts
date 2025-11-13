import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import type { Task, TaskCreate, TaskUpdate } from '../../types';

// ============================================
// State Interface
// ============================================
interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

// ============================================
// Async Thunks
// ============================================

/**
 * Fetch all tasks
 * GET /tasks
 */
export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (
    { skip = 0, limit = 100 }: { skip?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get<Task[]>('/tasks/', {
        params: { skip, limit },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch tasks');
    }
  }
);

/**
 * Fetch single task by ID
 * GET /tasks/{task_id}
 */
export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Task>(`/tasks/${taskId}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch task');
    }
  }
);

/**
 * Create new task
 * POST /tasks
 */
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: TaskCreate, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Task>('/tasks/', taskData);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create task');
    }
  }
);

/**
 * Update task
 * PUT /tasks/{task_id}
 */
export const updateTask = createAsyncThunk(
  'tasks/update',
  async (
    { taskId, data }: { taskId: string; data: TaskUpdate },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put<Task>(`/tasks/${taskId}`, data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update task');
    }
  }
);

/**
 * Delete task
 * DELETE /tasks/{task_id}
 */
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      return taskId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete task');
    }
  }
);

// ============================================
// Slice
// ============================================

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
      state.error = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addTaskOptimistic: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTaskOptimistic: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    // Local task management actions (for offline/demo usage)
    addLocalTask: (state, action: PayloadAction<{ title: string; description?: string }>) => {
      const newTask: Task = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: action.payload.title,
        description: action.payload.description,
        priority: 'Normal',
        is_completed: false,
        project_id: 'local',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.tasks.unshift(newTask);
    },
    toggleLocalTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.is_completed = !task.is_completed;
        task.updated_at = new Date().toISOString();
      }
    },
    deleteLocalTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ============ FETCH ALL TASKS ============
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH TASK BY ID ============
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTaskById.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.loading = false;
          state.currentTask = action.payload;
        }
      )
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ CREATE TASK ============
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.currentTask = action.payload;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ UPDATE TASK ============
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ DELETE TASK ============
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearCurrentTask,
  clearTasks,
  clearError,
  addTaskOptimistic,
  removeTaskOptimistic,
  addLocalTask,
  toggleLocalTask,
  deleteLocalTask,
} = taskSlice.actions;

export default taskSlice.reducer;
