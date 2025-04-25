import { createTheme, styled } from '@mui/material/styles';
import { Container, Card, TableRow } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: { main: '#6366f1' },
    secondary: { main: '#ec4899' },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600 },
    body2: { fontWeight: 500 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: { borderCollapse: 'separate', borderSpacing: '0 8px' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: 'none', padding: '12px 16px' },
        head: { fontWeight: 600, color: '#64748b', background: '#f1f5f9' },
      },
    },
  },
});

export const DashboardContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6),
  background: theme.palette.background.default,
  minHeight: '100vh',
  borderRadius: 24,
  marginTop: theme.spacing(4),
  boxShadow: '0 8px 40px rgba(0,0,0,0.04)',
}));

export const StatCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 6,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

export const TableRowStyled = styled(TableRow)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 12,
  marginBottom: theme.spacing(1),
  '&:hover': {
    background: '#f1f5f9',
    transform: 'scale(1.01)',
    transition: 'all 0.2s ease',
  },
}));