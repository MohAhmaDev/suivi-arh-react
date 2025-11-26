import { createTheme } from "@mui/material/styles";

const primary = {
  50: "#E3F2FD",
  100: "#BBDEFB",
  200: "#90CAF9",
  300: "#64B5F6",
  400: "#42A5F5",
  500: "#2196F3",
  600: "#1E88E5",
  700: "#1976D2",
  800: "#1565C0",
  900: "#0D47A1",
};

const baseTheme = createTheme();
const customShadows = [...baseTheme.shadows];
customShadows[1] = "0 1px 2px 0 rgba(15, 23, 42, 0.08)";
customShadows[2] = "0 4px 6px -1px rgba(15, 23, 42, 0.10), 0 2px 4px -2px rgba(15, 23, 42, 0.10)";
customShadows[3] = "0 10px 15px -3px rgba(15, 23, 42, 0.10), 0 4px 6px -4px rgba(15, 23, 42, 0.10)";
customShadows[4] = "0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 10px 10px -5px rgba(15, 23, 42, 0.04)";

const theme = createTheme({
  spacing: 8,
  palette: {
    mode: "light",
    primary: {
      50: primary[50],
      100: primary[100],
      main: primary[500],
      light: primary[300],
      dark: primary[700],
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: primary[700],
      light: primary[500],
      dark: primary[900],
      contrastText: "#FFFFFF",
    },
    success: {
      50: "#ECFDF5",
      main: "#10B981",
      light: "#6EE7B7",
      dark: "#047857",
      contrastText: "#053321",
    },
    warning: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#B45309",
      contrastText: "#3F1D06",
    },
    error: {
      50: "#FEF2F2",
      100: "#FEE2E2",
      main: "#EF4444",
      light: "#FCA5A5",
      dark: "#B91C1C",
      contrastText: "#3F0B0B",
    },
    info: {
      50: primary[50],
      main: primary[500],
      light: primary[100],
      dark: primary[700],
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
      disabled: "#94A3B8",
    },
    divider: "#E2E8F0",
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "32px",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h2: {
      fontSize: "24px",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "20px",
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h4: {
      fontSize: "18px",
      fontWeight: 600,
      lineHeight: 1.35,
    },
    body1: {
      fontSize: "16px",
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: "14px",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "12px",
      lineHeight: 1.4,
    },
    button: {
      fontSize: "16px",
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shadows: customShadows,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: "border-box",
        },
        body: {
          margin: 0,
          backgroundColor: "#F8FAFC",
          color: "#1E293B",
          fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif',
          minHeight: "100vh",
          WebkitFontSmoothing: "antialiased",
        },
        a: {
          color: primary[600],
        },
        "button:focus-visible, a:focus-visible, [role='button']:focus-visible": {
          outline: `2px solid ${primary[500]}`,
          outlineOffset: "2px",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 600,
          textTransform: "none",
          minHeight: "40px",
          paddingInline: "24px",
          transition: "all 0.2s ease",
          boxShadow: "none",
        },
        sizeSmall: {
          minHeight: "32px",
          paddingInline: "16px",
        },
        sizeLarge: {
          minHeight: "48px",
          paddingInline: "32px",
        },
        containedPrimary: {
          backgroundColor: primary[600],
          '&:hover': {
            backgroundColor: primary[700],
            boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.2)",
          },
        },
        outlined: {
          borderWidth: "2px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          boxShadow: customShadows[2],
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          boxShadow: customShadows[1],
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
          '&:last-child': {
            paddingBottom: "24px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "999px",
          fontWeight: 600,
          fontSize: "12px",
          height: "24px",
          paddingInline: "8px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          minHeight: "48px",
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: primary[500],
            borderWidth: "2px",
          },
        },
        input: {
          padding: "12px 16px",
        },
        notchedOutline: {
          borderColor: "#CBD5E1",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: "#475569",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "#EF4444",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: primary[50],
          '& .MuiTableCell-root': {
            fontWeight: 600,
            fontSize: "14px",
            color: "#0F172A",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingBlock: "16px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#0F172A",
          boxShadow: customShadows[1],
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          paddingInline: "16px",
          minHeight: "40px",
          '&.Mui-selected': {
            backgroundColor: primary[50],
            color: primary[700],
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
});

export default theme;
