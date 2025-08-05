import { createTheme } from '@mui/material'

// Create modern theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Modern indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#f59e0b', // Warm amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#10b981', // Modern emerald
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Warm amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // Modern red
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#0f0f23', // Deep space blue
      paper: '#1a1a3a', // Darker space blue
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
  shape: {
    borderRadius: 10, // More rounded corners
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
          borderRadius: 10,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: 4,
          // paddingLeft: '0 !important',
          // paddingRight: '0 !important',
          minWidth: 'unset !important',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        contained: {
          borderWidth: 1,
          borderColor: 'transparent',
          borderStyle: 'solid',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
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
          borderRadius: 8,
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
        },
      },
    },
  },
})

export default theme
