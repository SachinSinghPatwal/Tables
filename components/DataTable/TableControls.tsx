'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Paper,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewColumn as ViewColumnIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  Edit as EditIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import {
  setSearchQuery,
  toggleEditMode,
  toggleTheme,
} from '@/lib/store/slices/dataTableSlice';
import { ManageColumnsModal } from './ManageColumnsModal';
import { ImportExportButtons } from './ImportExportButtons';

export function TableControls() {
  const dispatch = useAppDispatch();
  const { searchQuery, isEditMode, theme, columns } = useAppSelector((state) => state.dataTable);
  const [showColumnsModal, setShowColumnsModal] = useState(false);

  const visibleColumnsCount = columns.filter(col => col.visible).length;

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} alignItems="center">
        {/* Search */}
        <TextField
          placeholder="Search all fields..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          variant="outlined"
          size="small"
          sx={{ minWidth: { xs: '100%', md: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
          {/* Visible Columns Info */}
          <Chip
            icon={<ViewColumnIcon />}
            label={`${visibleColumnsCount} columns visible`}
            variant="outlined"
            onClick={() => setShowColumnsModal(true)}
            clickable
          />

          {/* Import/Export */}
          <ImportExportButtons />

          {/* Edit Mode Toggle */}
          <Tooltip title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}>
            <IconButton
              onClick={() => dispatch(toggleEditMode())}
              color={isEditMode ? 'primary' : 'default'}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              onClick={() => dispatch(toggleTheme())}
              size="small"
            >
              {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <ManageColumnsModal
        open={showColumnsModal}
        onClose={() => setShowColumnsModal(false)}
      />
    </Paper>
  );
}