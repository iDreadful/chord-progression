import { createTheme } from '@mui/material'

// Create neumorphic light theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6b7280', // Subtle gray
      light: '#9ca3af',
      dark: '#374151',
    },
    secondary: {
      main: '#4f46e5', // Accent indigo
      light: '#6366f1',
      dark: '#3730a3',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    background: {
      default: '#f1f5f9', // Light gray background
      paper: '#ffffff', // Pure white cards
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  shape: {
    borderRadius: 16, // More rounded corners for neumorphic look
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '1.25em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '1em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      fontSize: '.75em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      fontSize: '.5em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiCard: {
      defaultProps: {
        //   style: {
        // borderRadius: 10,
        //   },
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: 4,
          minWidth: 'unset !important',
          transition: 'all 0.2s ease-in-out',
          borderRadius: 12,
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: '#ffffff',
          color: '#374151',
          boxShadow:
            '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          '&:hover': {
            background: '#f8fafc',
            boxShadow:
              '0 6px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          },
          '&:active': {
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(0)',
          },
        },
        outlined: {
          background: '#f8fafc',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          color: '#374151',
          boxShadow:
            'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 8px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            background: '#f1f5f9',
            borderColor: 'rgba(0, 0, 0, 0.15)',
            boxShadow:
              'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 32,
        },
        filled: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {},
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: '#ffffff',
          boxShadow:
            '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          '&:hover': {
            background: '#f8fafc',
            boxShadow:
              '0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {},
      },
    },
  },
})

export default theme
