# Redux Store Setup Guide

## Estructura de carpetas

```
src/
├── api/
│   └── client.ts              # Cliente Axios configurado
├── store/
│   ├── store.ts               # Configuración de Redux
│   ├── hooks/
│   │   └── index.ts           # Hooks tipados (useAppDispatch, useAppSelector)
│   └── slices/
│       └── exampleSlice.ts    # Ejemplo de slice
├── types/
│   └── index.ts               # Tipos globales
└── ...
```

## Cómo usar

### 1. Agregar un nuevo Slice

Crear un archivo en `src/store/slices/` (ej: `userSlice.ts`):

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;
```

### 2. Registrar el Slice en el Store

En `src/store/store.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
```

### 3. Usar en componentes

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from '../store/slices/userSlice';

export default function UserList() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 4. Configurar Provider en App.tsx

```typescript
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

export default function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
```

## Cliente Axios

El cliente Axios está configurado en `src/api/client.ts` y proporciona métodos para:

- `GET`: `apiClient.get('/endpoint')`
- `POST`: `apiClient.post('/endpoint', data)`
- `PUT`: `apiClient.put('/endpoint', data)`
- `DELETE`: `apiClient.delete('/endpoint')`
- `PATCH`: `apiClient.patch('/endpoint', data)`

Incluye interceptores para manejo de errores y autenticación.
