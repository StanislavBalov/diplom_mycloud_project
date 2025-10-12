import { createSlice } from "@reduxjs/toolkit";

const filesSlice = createSlice({
  name: "files",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    sortBy: "uploaded_at",
    sortDirection: "desc",
  },
  reducers: {
    setFiles(state, action) {
      state.list = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    addFile(state, action) {
      state.list.push(action.payload);
      state.list.sort((a, b) => {
        const aVal = a[state.sortBy];
        const bVal = b[state.sortBy];
        if (state.sortDirection === "asc") {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    },
    removeFile(state, action) {
      state.list = state.list.filter((f) => f.id !== action.payload);
    },
    updateFile(state, action) {
      const updated = action.payload;
      const idx = state.list.findIndex((f) => f.id === updated.id);
      if (idx !== -1) {
        state.list[idx] = updated;
        state.list.sort((a, b) => {
          const aVal = a[state.sortBy];
          const bVal = b[state.sortBy];
          if (state.sortDirection === "asc") {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
          }
        });
      }
    },
    setSort(state, action) {
      const { sortBy, sortDirection } = action.payload;
      state.sortBy = sortBy;
      state.sortDirection = sortDirection;
      state.list.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortDirection === "asc") {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    },
    clearError(state) {
      state.error = null;
    },
    setLoading(state, action) {
      state.status = action.payload ? "loading" : "idle";
    },
  },
});

export const {
  setFiles,
  addFile,
  removeFile,
  updateFile,
  setSort,
  clearError,
  setLoading,
} = filesSlice.actions;

export default filesSlice.reducer;