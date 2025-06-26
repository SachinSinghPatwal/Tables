# Dynamic Data Table Manager

A comprehensive, production-ready table management system built with Next.js, Material-UI, and Redux Toolkit. This application provides advanced data manipulation capabilities with a beautiful, responsive interface.

## 🚀 Features

### Core Functionality
- **Dynamic Data Management**: Add, edit, delete, and manage tabular data
- **Advanced Search**: Real-time search across all table fields
- **Column Management**: Show/hide columns, add custom columns, reorder via drag & drop
- **Sorting**: Multi-column sorting with visual indicators
- **Pagination**: Configurable page sizes with navigation controls
- **Import/Export**: CSV import and export functionality
- **Inline Editing**: Edit data directly in the table with validation
- **Theme Toggle**: Light/dark mode with persistent preferences

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Drag & Drop**: Reorder columns by dragging headers
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Visual Feedback**: Hover states, transitions, and loading indicators
- **Data Persistence**: State persisted across browser sessions

## 🏗️ Project Structure

```
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and theme variables
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Main application page
│
├── components/                   # React components
│   ├── DataTable/               # Table-related components
│   │   ├── DataTable.tsx        # Main table component
│   │   ├── EditableCell.tsx     # Inline editing cell component
│   │   ├── ImportExportButtons.tsx # CSV import/export functionality
│   │   ├── ManageColumnsModal.tsx  # Column management dialog
│   │   ├── SortableTableHeader.tsx # Draggable column headers
│   │   └── TableControls.tsx    # Search, filters, and controls
│   │
│   ├── providers/               # Context providers
│   │   ├── ReduxProvider.tsx    # Redux store provider
│   │   └── ThemeProvider.tsx    # Material-UI theme provider
│   │
│   └── ui/                      # Shadcn/ui components (auto-generated)
│
├── lib/                         # Utilities and configuration
│   ├── hooks/                   # Custom React hooks
│   │   └── redux.ts            # Typed Redux hooks
│   │
│   ├── store/                   # Redux store configuration
│   │   ├── slices/             # Redux slices
│   │   │   └── dataTableSlice.ts # Main data table state management
│   │   └── store.ts            # Store configuration with persistence
│   │
│   └── utils.ts                # Utility functions
│
├── components.json              # Shadcn/ui configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 13.5**: React framework with App Router
- **React 18.2**: UI library with hooks and modern patterns
- **TypeScript**: Type-safe development

### UI & Styling
- **Material-UI (MUI) 5.15**: Component library and design system
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality component collection
- **Emotion**: CSS-in-JS styling solution

### State Management
- **Redux Toolkit**: Modern Redux with simplified syntax
- **React-Redux**: React bindings for Redux
- **Redux Persist**: State persistence across sessions

### Data Handling
- **PapaParse**: CSV parsing and generation
- **File-Saver**: Client-side file downloads

### Drag & Drop
- **@dnd-kit**: Modern drag and drop toolkit
- **@dnd-kit/sortable**: Sortable functionality

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🚦 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dynamic-data-table-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📊 Data Structure

### Table Row Interface
```typescript
interface TableRow {
  id: string;              // Unique identifier
  name: string;            // Person's name
  email: string;           // Email address
  age: number;             // Age in years
  role: string;            // Job role
  department?: string;     // Department (optional)
  location?: string;       // Location (optional)
  [key: string]: any;      // Dynamic fields
}
```

### Column Configuration
```typescript
interface Column {
  id: string;              // Unique column identifier
  label: string;           // Display name
  visible: boolean;        // Show/hide column
  sortable: boolean;       // Enable sorting
  type: 'text' | 'number' | 'email'; // Data type
}
```

## 🎯 Key Components

### DataTable Component
The main table component that handles:
- Data rendering with pagination
- Sorting and filtering
- Inline editing mode
- Row selection and actions
- Drag & drop column reordering

### TableControls Component
Control panel featuring:
- Global search functionality
- Column visibility management
- Import/Export buttons
- Edit mode toggle
- Theme switcher

### ManageColumnsModal Component
Dialog for:
- Toggling column visibility
- Adding custom columns
- Column type configuration

### Redux Store Structure
```typescript
interface DataTableState {
  data: TableRow[];           // Table data
  columns: Column[];          // Column definitions
  searchQuery: string;        // Search filter
  sortConfig: SortConfig;     // Sort configuration
  currentPage: number;        // Current page number
  rowsPerPage: number;        // Rows per page
  isEditMode: boolean;        // Edit mode state
  editingRows: string[];      // Currently editing rows
  theme: 'light' | 'dark';    // Theme preference
}
```

## 🔧 Configuration

### Theme Customization
The application supports both light and dark themes. Theme configuration is in:
- `app/globals.css` - CSS custom properties
- `components/providers/ThemeProvider.tsx` - Material-UI theme

### Default Data
Sample data is defined in `lib/store/slices/dataTableSlice.ts`. You can modify the `defaultData` array to change initial data.

### Column Configuration
Default columns are configured in the same slice file. Add or modify the `defaultColumns` array to change table structure.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px - Stacked layout, simplified controls
- **Tablet**: 768px - 1024px - Condensed layout
- **Desktop**: > 1024px - Full feature layout

## 🎨 Styling Architecture

### CSS Custom Properties
Global theme variables defined in `app/globals.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  /* ... more variables */
}
```

### Component Styling
- **Material-UI**: Primary component styling
- **Tailwind CSS**: Utility classes for layout and spacing
- **CSS-in-JS**: Dynamic styling with Emotion

## 🔒 Data Persistence

State is automatically persisted using Redux Persist:
- **Storage**: Browser localStorage
- **Whitelist**: Only `dataTable` slice is persisted
- **Rehydration**: State restored on app load

## 🧪 Testing Considerations

For testing this application, consider:
- **Unit Tests**: Individual component functionality
- **Integration Tests**: Redux store interactions
- **E2E Tests**: Complete user workflows
- **Accessibility Tests**: Screen reader compatibility

## 🚀 Deployment

### Static Export
The app is configured for static export:
```bash
npm run build
```

This generates a static site in the `out/` directory.

### Deployment Platforms
Compatible with:
- **Vercel**: Optimal for Next.js applications
- **Netlify**: Static site hosting
- **GitHub Pages**: Free static hosting
- **AWS S3**: Cloud storage with CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Material-UI Team**: For the excellent component library
- **Redux Toolkit Team**: For simplifying Redux development
- **Next.js Team**: For the powerful React framework
- **Tailwind CSS**: For the utility-first CSS framework

---

**Built with ❤️ using modern web technologies**
