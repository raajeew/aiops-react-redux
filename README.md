# AIOps ReactJS Dashboard

A comprehensive AIOps (Artificial Intelligence for IT Operations) dashboard built with React, TypeScript, Redux Toolkit, and Tailwind CSS. This application provides real-time monitoring, incident management, and system configuration capabilities.

## Features

### 🔍 Overview Page
- Real-time system health metrics
- Service status dashboard
- Active alerts management
- Performance trends visualization
- Key system statistics

### 🔧 Services Page
- Comprehensive service monitoring
- Health score tracking
- Response time monitoring
- Uptime statistics
- Service status management
- Environment-based filtering

### ⚠️ Situations Page
- Incident tracking and management
- Severity-based categorization
- Status workflow management
- Assignee tracking
- Tag-based organization
- Create new situations

### ⚙️ Configuration Page
- System settings management
- Category-based organization
- Real-time configuration updates
- Type-safe value editing
- Reset to default capabilities

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Data Management**: Mock JSON API with async operations

## Installation and Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navigation.tsx   # Main navigation component
├── pages/              # Page components
│   ├── Overview.tsx    # Dashboard overview
│   ├── Services.tsx    # Services monitoring
│   ├── Situations.tsx  # Incident management
│   └── Configuration.tsx # System settings
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices
│   ├── thunks/         # Async thunks
│   └── index.ts        # Store configuration
├── services/           # API services
│   └── api.ts          # Mock API implementation
├── data/               # Mock data
│   └── mockData.ts     # Sample data for development
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── hooks/              # Custom React hooks
│   └── redux.ts        # Typed Redux hooks
└── App.tsx             # Main application component
```

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
