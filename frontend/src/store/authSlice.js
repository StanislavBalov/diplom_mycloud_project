import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postJson, getJson } from '../api';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { res, body } = await postJson('/auth/login/', credentials);
      if (!res.ok) {
        return rejectWithValue(body.detail || 'Ошибка входа');
      }
      if (body.token) {
        localStorage.setItem('authToken', body.token);
        api.setToken(body.token);
      }
      return body.user;
    } catch (error) {
      return rejectWithValue('Ошибка подключения к серверу');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await postJson('/auth/logout/');
    } catch (error) {
      console.warn('Ошибка при выходе:', error);
    } finally {
      localStorage.removeItem('authToken');
      dispatch(clearUser());
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('Токен отсутствует');
      }
      const { res, body } = await getJson('/auth/me/');
      if (!res.ok) {
        return rejectWithValue(body.detail || 'Ошибка получения профиля');
      }
      return body;
    } catch (error) {
      return rejectWithValue('Ошибка подключения к серверу');
    }
  }
);

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
      });
  },
});

export const { setUser, clearUser, clearError } = authSlice.actions;
export default authSlice.reducer;