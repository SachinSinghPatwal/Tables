'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import {
  toggleColumnVisibility,
  addColumn,
  Column,
} from '@/lib/store/slices/dataTableSlice';

interface ManageColumnsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ManageColumnsModal({ open, onClose }: ManageColumnsModalProps) {
  const dispatch = useAppDispatch();
  const { columns } = useAppSelector((state) => state.dataTable);
  
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<Column['type']>('text');

  const handleToggleVisibility = (columnId: string) => {
    dispatch(toggleColumnVisibility(columnId));
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const columnId = newColumnName.toLowerCase().replace(/\s+/g, '_');
      const newColumn: Column = {
        id: columnId,
        label: newColumnName,
        visible: true,
        sortable: true,
        type: newColumnType,
      };
      
      dispatch(addColumn(newColumn));
      setNewColumnName('');
      setNewColumnType('text');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddColumn();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Toggle column visibility and add new custom columns to your table.
        </Typography>

        {/* Existing Columns */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Column Visibility
          </Typography>
          
          {columns.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox
                  checked={column.visible}
                  onChange={() => handleToggleVisibility(column.id)}
                />
              }
              label={
                <Box>
                  <Typography variant="body1">{column.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {column.type} • {column.sortable ? 'Sortable' : 'Not sortable'}
                  </Typography>
                </Box>
              }
              sx={{ display: 'block', mb: 1 }}
            />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Add New Column */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Column
        </Typography>
        
        <Box display="flex" gap={2} alignItems="flex-end" flexWrap="wrap">
          <TextField
            label="Column Name"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={newColumnType}
              label="Type"
              onChange={(e) => setNewColumnType(e.target.value as Column['type'])}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="email">Email</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddColumn}
            disabled={!newColumnName.trim()}
            size="small"
          >
            Add
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          New columns will be added to all existing rows with empty values.
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}