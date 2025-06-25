"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import {
  setSortConfig,
  setCurrentPage,
  updateRow,
  deleteRow,
  setEditingRow,
  reorderColumns,
  TableRow as TableRowType,
} from "@/lib/store/slices/dataTableSlice";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTableHeader } from "./SortableTableHeader";
import { EditableCell } from "./EditableCell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export function DataTable() {
  const dispatch = useAppDispatch();
  const {
    data,
    columns,
    searchQuery,
    sortConfig,
    currentPage,
    isEditMode,
    editingRows,
  } = useAppSelector((state) => state.dataTable);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const visibleColumns = columns.filter((col) => col.visible);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchQuery) {
      filtered = data.filter((row: Record<string, any>) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered = [...filtered].sort(
        (a: Record<string, any>, b: Record<string, any>) => {
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];

          if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }
      );
    }
    return filtered;
  }, [data, searchQuery, sortConfig]);

  const rowsPerPage = 10; // Always 10 items per page
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, rowsPerPage]);

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    const isAsc =
      sortConfig?.key === columnId && sortConfig.direction === "asc";
    dispatch(
      setSortConfig({
        key: columnId,
        direction: isAsc ? "desc" : "asc",
      })
    );
  };

  const handleEdit = (rowId: string) => {
    dispatch(setEditingRow({ id: rowId, editing: true }));
  };

  const handleSave = (rowId: string, newData: Partial<TableRowType>) => {
    dispatch(updateRow({ id: rowId, data: newData }));
    dispatch(setEditingRow({ id: rowId, editing: false }));
  };

  const handleCancel = (rowId: string) => {
    dispatch(setEditingRow({ id: rowId, editing: false }));
  };

  const handleDelete = (rowId: string) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      dispatch(deleteRow(rowId));
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      dispatch(reorderColumns({ activeId: active.id, overId: over.id }));
    }
  };

  return (
    <Paper elevation={3}>
      <TableContainer>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHead>
              <TableRow>
                <SortableContext
                  items={visibleColumns.map((col) => col.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {visibleColumns.map((column) => (
                    <SortableTableHeader
                      key={column.id}
                      column={column}
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                  ))}
                </SortableContext>
                {isEditMode && (
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row: TableRowType) => {
                const isEditing =
                  Array.isArray(editingRows) && editingRows.includes(row.id);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                      backgroundColor: isEditing
                        ? "action.selected"
                        : "inherit",
                    }}
                  >
                    {visibleColumns.map((column) => (
                      <EditableCell
                        key={`${row.id}-${column.id}`}
                        value={row[column.id]}
                        column={column}
                        isEditing={isEditing}
                        onSave={(value: any) =>
                          handleSave(row.id, { [column.id]: value })
                        }
                      />
                    ))}
                    {isEditMode && (
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          {isEditing ? (
                            <>
                              <Tooltip title="Save">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleSave(row.id, row)}
                                >
                                  <SaveIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel">
                                <IconButton
                                  size="small"
                                  color="secondary"
                                  onClick={() => handleCancel(row.id)}
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEdit(row.id)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(row.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DndContext>
      </TableContainer>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                if (currentPage > 0) dispatch(setCurrentPage(currentPage - 1));
              }}
              aria-disabled={currentPage === 0}
              tabIndex={currentPage === 0 ? -1 : 0}
              style={{
                pointerEvents: currentPage === 0 ? "none" : undefined,
                opacity: currentPage === 0 ? 0.5 : 1,
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink
                isActive={currentPage === idx}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  dispatch(setCurrentPage(idx));
                }}
                href="#"
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                if (currentPage < totalPages - 1)
                  dispatch(setCurrentPage(currentPage + 1));
              }}
              aria-disabled={currentPage === totalPages - 1}
              tabIndex={currentPage === totalPages - 1 ? -1 : 0}
              style={{
                pointerEvents:
                  currentPage === totalPages - 1 ? "none" : undefined,
                opacity: currentPage === totalPages - 1 ? 0.5 : 1,
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Paper>
  );
}
