'use client';

import React, { useRef, useState } from 'react';
import {
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import {
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { setData, TableRow } from '@/lib/store/slices/dataTableSlice';

export function ImportExportButtons() {
  const dispatch = useAppDispatch();
  const { data, columns } = useAppSelector((state) => state.dataTable);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      showNotification('Please select a valid CSV file', 'error');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          showNotification(`CSV parsing errors: ${results.errors[0].message}`, 'error');
          return;
        }

        try {
          const importedData: TableRow[] = results.data.map((row: any, index: number) => ({
            id: `imported-${Date.now()}-${index}`,
            name: row.name || row.Name || '',
            email: row.email || row.Email || '',
            age: parseInt(row.age || row.Age) || 0,
            role: row.role || row.Role || '',
            department: row.department || row.Department || '',
            location: row.location || row.Location || '',
            ...row, // Include any additional fields from the CSV
          }));

          if (importedData.length === 0) {
            showNotification('No valid data found in CSV file', 'error');
            return;
          }

          dispatch(setData(importedData));
          showNotification(`Successfully imported ${importedData.length} rows`);
        } catch (error) {
          showNotification('Error processing CSV data', 'error');
        }
      },
      error: (error) => {
        showNotification(`File reading error: ${error.message}`, 'error');
      },
    });

    // Clear the input
    event.target.value = '';
  };

  const handleExport = () => {
    try {
      const visibleColumns = columns.filter(col => col.visible);
      
      // Prepare data with only visible columns
      const exportData = data.map(row => {
        const exportRow: any = {};
        visibleColumns.forEach(col => {
          exportRow[col.label] = row[col.id] || '';
        });
        return exportRow;
      });

      // Convert to CSV
      const csv = Papa.unparse(exportData);
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const fileName = `data-export-${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, fileName);
      
      showNotification(`Exported ${exportData.length} rows to ${fileName}`);
    } catch (error) {
      showNotification('Error exporting data', 'error');
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title="Import CSV">
        <IconButton onClick={handleImport} size="small">
          <FileUploadIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Export CSV">
        <IconButton onClick={handleExport} size="small" disabled={data.length === 0}>
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}