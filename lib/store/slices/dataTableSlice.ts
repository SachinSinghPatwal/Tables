import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
  [key: string]: any;
}

export interface Column {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  type: 'text' | 'number' | 'email';
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface DataTableState {
  data: TableRow[];
  columns: Column[];
  searchQuery: string;
  sortConfig: SortConfig | null;
  currentPage: number;
  rowsPerPage: number;
  isEditMode: boolean;
  editingRows: string[];
  theme: 'light' | 'dark';
}

const defaultColumns: Column[] = [
  { id: 'name', label: 'Name', visible: true, sortable: true, type: 'text' },
  { id: 'email', label: 'Email', visible: true, sortable: true, type: 'email' },
  { id: 'age', label: 'Age', visible: true, sortable: true, type: 'number' },
  { id: 'role', label: 'Role', visible: true, sortable: true, type: 'text' },
  { id: 'department', label: 'Department', visible: false, sortable: true, type: 'text' },
  { id: 'location', label: 'Location', visible: false, sortable: true, type: 'text' },
];

const defaultData: TableRow[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 28,
    role: 'Developer',
    department: 'Engineering',
    location: 'New York',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    age: 32,
    role: 'Designer',
    department: 'Design',
    location: 'San Francisco',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    age: 35,
    role: 'Manager',
    department: 'Management',
    location: 'Chicago',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    age: 29,
    role: 'Developer',
    department: 'Engineering',
    location: 'Austin',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    age: 41,
    role: 'Director',
    department: 'Management',
    location: 'Boston',
  },
];

const initialState: DataTableState = {
  data: defaultData,
  columns: defaultColumns,
  searchQuery: '',
  sortConfig: null,
  currentPage: 0,
  rowsPerPage: 10,
  isEditMode: false,
  editingRows: [],
  theme: 'light',
};

const dataTableSlice = createSlice({
  name: 'dataTable',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<{ id: string; data: Partial<TableRow> }>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload.data };
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 0;
    },
    setSortConfig: (state, action: PayloadAction<SortConfig | null>) => {
      state.sortConfig = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.currentPage = 0;
    },
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
      if (!state.isEditMode) {
        state.editingRows = [];
      }
    },
    setEditingRow: (state, action: PayloadAction<{ id: string; editing: boolean }>) => {
      const editingRowsSet = new Set(state.editingRows);
      if (action.payload.editing) {
        editingRowsSet.add(action.payload.id);
      } else {
        editingRowsSet.delete(action.payload.id);
      }
      state.editingRows = Array.from(editingRowsSet);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    reorderColumns: (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
      const { activeId, overId } = action.payload;
      const oldIndex = state.columns.findIndex(col => col.id === activeId);
      const newIndex = state.columns.findIndex(col => col.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const [reorderedColumn] = state.columns.splice(oldIndex, 1);
        state.columns.splice(newIndex, 0, reorderedColumn);
      }
    },
  },
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  setColumns,
  toggleColumnVisibility,
  addColumn,
  setSearchQuery,
  setSortConfig,
  setCurrentPage,
  setRowsPerPage,
  toggleEditMode,
  setEditingRow,
  toggleTheme,
  reorderColumns,
} = dataTableSlice.actions;

export default dataTableSlice.reducer;