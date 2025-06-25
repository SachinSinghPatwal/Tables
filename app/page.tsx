"use client";

import { Box, Container, Typography, Paper } from "@mui/material";
import { DataTable } from "@/components/DataTable/DataTable";
import { TableControls } from "@/components/DataTable/TableControls";

export default function Home() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          color: "white",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight="bold"
          className="dark:text-white text-black"
        >
          Dynamic Data Table Manager
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{ opacity: 0.9 }}
          className="dark:text-white text-black"
        >
          A comprehensive table management system with sorting, filtering,
          import/export, and inline editing capabilities.
        </Typography>
      </Paper>
      <Box sx={{ mb: 3 }}>
        <TableControls />
      </Box>
      <DataTable />
    </Container>
  );
}
