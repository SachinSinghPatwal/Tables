'use client';

import React, { useState, useEffect } from 'react';
import { TableCell, TextField } from '@mui/material';
import { Column } from '@/lib/store/slices/dataTableSlice';

interface EditableCellProps {
  value: any;
  column: Column;
  isEditing: boolean;
  onSave: (value: any) => void;
}

export function EditableCell({ value, column, isEditing, onSave }: EditableCellProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value, isEditing]);

  const handleSave = () => {
    let processedValue = localValue;
    
    if (column.type === 'number') {
      processedValue = Number(localValue);
      if (isNaN(processedValue)) {
        processedValue = value; // Revert to original if invalid
      }
    }
    
    onSave(processedValue);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setLocalValue(value);
    }
  };

  if (!isEditing) {
    let displayValue = value;
    
    if (column.type === 'email') {
      displayValue = (
        <a href={`mailto:${value}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {value}
        </a>
      );
    }
    
    return <TableCell>{displayValue}</TableCell>;
  }

  return (
    <TableCell>
      <TextField
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        type={column.type === 'number' ? 'number' : 'text'}
        size="small"
        fullWidth
        variant="standard"
        sx={{
          '& .MuiInput-underline:before': {
            borderBottomColor: 'transparent',
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: 'primary.main',
          },
        }}
      />
    </TableCell>
  );
}