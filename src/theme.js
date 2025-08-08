import { createTheme } from '@mui/material'
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#8b5cf6',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#06b6d4',
      light: '#0891b2',
      dark: '#0e7490',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#e2e8f0',
      paper: '#e2e8f0',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '1.25em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '1rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '.5rem',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '.85rem',
    },
    body2: { fontSize: '.75em' },
    button: {},
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: '#e2e8f0',
          backgroundImage: 'none',
          border: 'none',
          boxShadow: `
            9px 9px 18px #bfc6d1,
            -9px -9px 18px #ffffff
          `,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          padding: '8px 16px',
          minWidth: 'unset !important',
          transition: 'all 0.2s ease-in-out',
          fontWeight: 600,
          fontSize: '.85rem',
          textTransform: 'none',
        },
        contained: {
          backgroundColor: '#e2e8f0',
          color: '#1e293b',
          boxShadow: `
            5px 5px 10px #bfc6d1,
            -5px -5px 10px #ffffff
          `,
          '&:hover': {
            boxShadow: `
            5px 5px 10px #bfc6d1,
            -5px -5px 10px #ffffff
          `,
            '&:active': {
              boxShadow: `
            inset 2px 2px 4px #bfc6d1,
            inset -2px -2px 4px #ffffff
          `,
            },
          },
        },
        outlined: {
          backgroundColor: '#e2e8f0',
          color: '#70829c',
          border: 'none',
          boxShadow: `
            inset 2px 2px 4px #bfc6d1,
            inset -2px -2px 4px #ffffff
          `,
          '&:hover': {
            backgroundColor: '#e2e8f0',
            boxShadow: `
            inset 2px 2px 4px #bfc6d1,
            inset -2px -2px 4px #ffffff
            `,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 32,
          backgroundColor: '#e2e8f0',
          borderRadius: 16,
          border: 'none',
          color: '#1e293b',
          boxShadow: `
            3px 3px 6px #bfc6d1,
            -3px -3px 6px #ffffff
          `,
        },
        filled: {
          backgroundColor: '#e2e8f0',
          boxShadow: `
            3px 3px 6px #bfc6d1,
            -3px -3px 6px #ffffff
          `,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#e2e8f0',
          backgroundImage: 'none',
          borderRadius: 16,
          border: 'none',
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#e2e8f0',
          border: 'none',
          color: '#1e293b',
          boxShadow: `
            4px 4px 8px #bfc6d1,
            -4px -4px 8px #ffffff
          `,
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: '#e2e8f0',
          boxShadow: `
            inset 3px 3px 6px #bfc6d1,
            inset -3px -3px 6px #ffffff
          `,
          '& .MuiButton-root': {
            border: 'none',
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#e2e8f0',
            borderRadius: 16,
            border: 'none',
            boxShadow: `
              inset 3px 3px 6px #bfc6d1,
              inset -3px -3px 6px #ffffff
            `,
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: 'none',
            },
            '&.Mui-focused': {
              boxShadow: `
                inset 4px 4px 8px #bfc6d1,
                inset -4px -4px 8px #ffffff
              `,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {},
      },
    },
  },
})
export default theme
