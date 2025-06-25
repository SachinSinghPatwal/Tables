'use client';

import React from 'react';
import { TableCell, TableSortLabel } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column, SortConfig } from '@/lib/store/slices/dataTableSlice';
import { DragIndicator } from '@mui/icons-material';

interface SortableTableHeaderProps {
  column: Column;
  sortConfig: SortConfig | null;
  onSort: (columnId: string) => void;
}

export function SortableTableHeader({ column, sortConfig, onSort }: SortableTableHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const isActive = sortConfig?.key === column.id;

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      sx={{
        fontWeight: 600,
        cursor: column.sortable ? 'pointer' : 'default',
        userSelect: 'none',
        position: 'relative',
        '&:hover .drag-handle': {
          opacity: 1,
        },
      }}
      {...attributes}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <DragIndicator
          className="drag-handle"
          sx={{ 
            opacity: 0.3, 
            cursor: 'grab', 
            fontSize: 16,
            transition: 'opacity 0.2s',
          }}
          {...listeners}
        />
        {column.sortable ? (
          <TableSortLabel
            active={isActive}
            direction={isActive ? sortConfig!.direction : 'asc'}
            onClick={() => onSort(column.id)}
          >
            {column.label}
          </TableSortLabel>
        ) : (
          column.label
        )}
      </div>
    </TableCell>
  );
}