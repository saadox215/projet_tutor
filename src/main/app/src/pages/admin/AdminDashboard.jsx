import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Grid, Tabs, Tab, CircularProgress, Alert, Snackbar,
  Paper, Divider, Container, useMediaQuery, IconButton, Tooltip, Fade
} from '@mui/material';
import { 
  Person, School, Class, Group, Dashboard, BarChart,
  Settings, Notifications, DataUsage, Add, Refresh
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@mui/material/styles';
import { theme, DashboardContainer } from '../theme/theme';
import StatCard from './statCard';
import UserTable from './UserTable';
import ClassTable from './ClassTable';
import UserDialog from './UserDialog';
import ClassDialog from './ClassDialog';
import ConfirmDialog from './ConfirmDialog';

function AdminHome() {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalProfessors: 0,
    totalClasses: 0,
    totalModules: 0,
    activeUsers: 0,
    pendingRequests: 0,
  });
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    prenom: '',
    password: '',
    email: '',
    role: '',
  });
  
  // New class form state
  const [newClass, setNewClass] = useState({
    name: '',
    professorId: '',
    description: '',
    capacity: 30,
    startDate: '',
    endDate: '',
  });

  // Responsive design
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // API configuration
  const API_BASE_URL = 'http://localhost:8081/api/admin';
  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token]);

  // Memoized professors list
  const professors = useMemo(() => {
    return users.filter(user => user.role === 'PROFESSEUR');
  }, [users]);

  // API calls
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/stats`, { headers });
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats({
        ...data,
        // Add placeholder values for future stats
        totalModules: data.totalModules || 0,
        activeUsers: data.activeUsers || 0,
        pendingRequests: data.pendingRequests || 0,
      });
    } catch (err) {
      setError(err.message);
      showSnackbar('Failed to load statistics', 'error');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users`, { headers });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      showSnackbar('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/classes`, { headers });
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      setError(err.message);
      showSnackbar('Failed to load classes', 'error');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  const createUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newUser),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
      
      const data = await response.json();
      setUsers(prev => [...prev, data]);
      setUserDialogOpen(false);
      setNewUser({ name: '', prenom: '', password: '', email: '', role: '' });
      fetchStats();
      showSnackbar('User created successfully', 'success');
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [newUser, headers, fetchStats]);

  const updateUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(newUser),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
      
      const data = await response.json();
      setUsers(prev => prev.map(u => u.id === data.id ? data : u));
      setUserDialogOpen(false);
      setSelectedUser(null);
      setNewUser({ name: '', prenom: '', password: '', email: '', role: '' });
      showSnackbar('User updated successfully', 'success');
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedUser, newUser, headers]);

  const deleteUser = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      
      setUsers(prev => prev.filter(u => u.id !== id));
      fetchStats();
      showSnackbar('User deleted successfully', 'success');
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  }, [headers, fetchStats]);

  const createClass = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/classes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newClass),
      });
      
      if (!response.ok) throw new Error('Failed to create class');
      
      const data = await response.json();
      setClasses(prev => [...prev, data]);
      setClassDialogOpen(false);
      setNewClass({ 
        name: '', 
        professorId: '', 
        description: '',
        capacity: 30,
        startDate: '',
        endDate: ''
      });
      fetchStats();
      showSnackbar('Class created successfully', 'success');
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [newClass, headers, fetchStats]);

  const updateClass = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/classes/${selectedClass.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(newClass),
      });
      
      if (!response.ok) throw new Error('Failed to update class');
      
      const data = await response.json();
      setClasses(prev => prev.map(c => c.id === data.id ? data : c));
      setClassDialogOpen(false);
      setSelectedClass(null);
      setNewClass({ 
        name: '', 
        professorId: '', 
        description: '',
        capacity: 30,
        startDate: '',
        endDate: ''
      });
      showSnackbar('Class updated successfully', 'success');
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedClass, newClass, headers]);

  const deleteClass = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) throw new Error('Failed to delete class');
      
      setClasses(prev => prev.filter(c => c.id !== id));
      fetchStats();
      showSnackbar('Class deleted successfully', 'success');
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  }, [headers, fetchStats]);

  const getUserById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${id}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      return data;
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [headers]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchStats(), fetchUsers(), fetchClasses()]);
      showSnackbar('Data refreshed successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to refresh data', 'error');
    } finally {
      setRefreshing(false);
    }
  }, [fetchStats, fetchUsers, fetchClasses]);

  // Utility functions
  const getProfessorName = useCallback((id) => {
    const professor = users.find(user => user.id === id && user.role === 'PROFESSEUR');
    return professor ? `${professor.name} ${professor.prenom}` : 'Not Assigned';
  }, [users]);

  const getRoleColor = useCallback((role) => {
    switch (role) {
      case 'ETUDIANT': return theme.palette.success.main;
      case 'PROFESSEUR': return theme.palette.primary.main;
      case 'ADMIN': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  }, []);

  const getRoleIcon = useCallback((role) => {
    switch (role) {
      case 'ETUDIANT': return <School />;
      case 'PROFESSEUR': return <Person />;
      case 'ADMIN': return <Dashboard />;
      default: return <Person />;
    }
  }, []);

  // Event handlers
  const handleUserChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleClassChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewClass(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEditUser = useCallback(async (user) => {
    const fullUserData = await getUserById(user.id);
    if (fullUserData) {
      setSelectedUser(fullUserData);
      setNewUser({
        name: fullUserData.name,
        prenom: fullUserData.prenom,
        password: '', // Don't display password for security
        email: fullUserData.email,
        role: fullUserData.role,
      });
      setUserDialogOpen(true);
    }
  }, [getUserById]);

  const handleEditClass = useCallback((classObj) => {
    setSelectedClass(classObj);
    setNewClass({
      name: classObj.name,
      professorId: classObj.professorId,
      description: classObj.description || '',
      capacity: classObj.capacity || 30,
      startDate: classObj.startDate || '',
      endDate: classObj.endDate || '',
    });
    setClassDialogOpen(true);
  }, []);

  const handleDeleteUser = useCallback((id) => {
    setConfirmDialog({
      open: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      onConfirm: () => deleteUser(id),
    });
  }, [deleteUser]);

  const handleDeleteClass = useCallback((id) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Class',
      message: 'Are you sure you want to delete this class? This action cannot be undone.',
      onConfirm: () => deleteClass(id),
    });
  }, [deleteClass]);

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
    setSearchTerm('');
    setSelectedRole('');
  }, []);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.07
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Memoized render functions
  const renderHeader = useMemo(() => (
    <Box sx={{ position: 'relative', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 50%, #10b981 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient 3s linear infinite',
              '@keyframes gradient': {
                '0%': { backgroundPosition: '0% center' },
                '100%': { backgroundPosition: '200% center' },
              },
              mb: 1,
              display: 'inline-block',
              fontSize: { xs: '1.8rem', md: '2.4rem' }
            }}
          >
            NEXUS CONTROL
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              position: 'relative',
              fontSize: { xs: '0.8rem', md: '1rem' },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                left: 0,
                bottom: '-10px',
                borderRadius: '2px'
              }
            }}
          >
            Enterprise Academy Management Portal
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 3, maxWidth: '600px', fontWeight: 500, lineHeight: 1.6 }}
          >
            Advanced ecosystem management with real-time analytics and comprehensive controls
          </Typography>
        </Box>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={refreshData} 
                disabled={refreshing}
                sx={{ 
                  bgcolor: 'background.paper', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: 'background.paper' }
                }}
              >
                <Refresh sx={{ color: theme.palette.primary.main, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="System Settings">
              <IconButton 
                sx={{ 
                  bgcolor: 'background.paper', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: 'background.paper' }
                }}
              >
                <Settings sx={{ color: theme.palette.text.secondary }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton 
                sx={{ 
                  bgcolor: 'background.paper', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  position: 'relative',
                  '&:hover': { bgcolor: 'background.paper' }
                }}
              >
                <Notifications sx={{ color: theme.palette.text.secondary }} />
                {stats.pendingRequests > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 12,
                      height: 12,
                      bgcolor: theme.palette.error.main,
                      borderRadius: '50%',
                      border: '2px solid white'
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
      
      <Box
        component={motion.div}
        sx={{
          position: 'absolute',
          right: { xs: '5%', md: '15%' },
          top: '-15px',
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: 'rgba(99, 102, 241, 0.15)',
          zIndex: -1,
        }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <Box
        component={motion.div}
        sx={{
          position: 'absolute',
          right: { xs: '15%', md: '25%' },
          top: '30px',
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          background: 'rgba(236, 72, 153, 0.15)',
          zIndex: -1,
        }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </Box>
  ), [isMobile, refreshData, refreshing, stats.pendingRequests]);

  const renderStats = useMemo(() => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          mb: 6, 
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BarChart sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Dashboard Overview
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<Group sx={{ color: theme.palette.primary.main }} />}
              color={theme.palette.primary.main}
              subtext="All registered users"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Students"
              value={stats.totalStudents}
              icon={<School sx={{ color: theme.palette.success.main }} />}
              color={theme.palette.success.main}
              subtext="Enrolled students"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Professors"
              value={stats.totalProfessors}
              icon={<Person sx={{ color: theme.palette.warning.main }} />}
              color={theme.palette.warning.main}
              subtext="Teaching faculty"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Classes"
              value={stats.totalClasses}
              icon={<Class sx={{ color: theme.palette.secondary.main }} />}
              color={theme.palette.secondary.main}
              subtext="Active courses"
            />
          </Grid>
          
          {/* Extra metrics for future functionality */}
          <Grid item xs={12} sm={6} md={4} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Learning Modules"
              value={stats.totalModules}
              icon={<DataUsage sx={{ color: '#8b5cf6' }} />}
              color="#8b5cf6"
              subtext="Learning resources"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              icon={<Person sx={{ color: '#06b6d4' }} />}
              color="#06b6d4"
              subtext="Currently online"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={<Notifications sx={{ color: '#f97316' }} />}
              color="#f97316"
              subtext="Need attention"
            />
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  ), [stats, containerVariants, itemVariants]);

  const renderTabs = useMemo(() => (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        bgcolor: 'background.paper',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
        border: '1px solid rgba(255,255,255,0.3)'
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant={isTablet ? "scrollable" : "standard"}
        scrollButtons={isTablet ? "auto" : false}
        sx={{
          p: 1,
          '& .MuiTabs-indicator': {
            height: 4,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        }}
      >
        <Tab
          label="Users"
          icon={<Person />}
          iconPosition="start"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            '&.Mui-selected': { color: 'primary.main' },
            py: 2,
            px: 4,
          }}
        />
        <Tab
          label="Classes"
          icon={<Class />}
          iconPosition="start"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            '&.Mui-selected': { color: 'primary.main' },
            py: 2,
            px: 4,
          }}
        />
        <Tab
          label="Learning Modules"
          icon={<School />}
          iconPosition="start"
          disabled
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            '&.Mui-selected': { color: 'primary.main' },
            py: 2,
            px: 4,
          }}
        />
        <Tab
          label="Reports"
          icon={<BarChart />}
          iconPosition="start"
          disabled
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            '&.Mui-selected': { color: 'primary.main' },
            py: 2,
            px: 4,
          }}
        />
        <Tab
          label="Settings"
          icon={<Settings />}
          iconPosition="start"
          disabled
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            '&.Mui-selected': { color: 'primary.main' },
            py: 2,
            px: 4,
          }}
        />
      </Tabs>
    </Paper>
  ), [activeTab, handleTabChange, isTablet]);

  const renderLoading = useMemo(() => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 300,
        py: 8
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <CircularProgress size={80} thickness={5} sx={{ color: 'primary.main' }} />
      </motion.div>
      <Typography 
        variant="h6" 
        sx={{ 
          mt: 3, 
          fontWeight: 600, 
          background: 'linear-gradient(90deg, #6366f1, #ec4899)', 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Loading data...
      </Typography>
    </Box>
  ), []);

  const renderError = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Alert
        severity="error"
        sx={{ 
          mb: 4, 
          borderRadius: 3, 
          bgcolor: '#fee2e2', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          '& .MuiAlert-icon': {
            color: theme.palette.error.main,
          }
        }}
      >
        {error}
      </Alert>
    </motion.div>
  ), [error]);

  // Load initial data
  useEffect(() => {
    Promise.all([fetchStats(), fetchUsers(), fetchClasses()])
      .catch(err => setError(err.message));
  }, [fetchStats, fetchUsers, fetchClasses]);

  return (
    <ThemeProvider theme={theme}>
      <DashboardContainer maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {renderHeader}
          {error && renderError}
          {renderStats}
          {renderTabs}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {renderLoading}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    mb: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  {activeTab === 0 && (
                    <UserTable
                      users={users}
                      searchTerm={searchTerm}
                      selectedRole={selectedRole}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      handleEditUser={handleEditUser}
                      handleDeleteUser={handleDeleteUser}
                      setSearchTerm={setSearchTerm}
                      setSelectedRole={setSelectedRole}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      handleOpenUserDialog={() => {
                        setSelectedUser(null);
                        setNewUser({ name: '', prenom: '', password: '', email: '', role: '' });
                        setUserDialogOpen(true);
                      }}
                      getRoleColor={getRoleColor}
                      getRoleIcon={getRoleIcon}
                    />
                  )}
                  {activeTab === 1 && (
                    <ClassTable
                      classes={classes}
                      searchTerm={searchTerm}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      handleEditClass={handleEditClass}
                      handleDeleteClass={handleDeleteClass}
                      setSearchTerm={setSearchTerm}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      handleOpenClassDialog={() => {
                        setSelectedClass(null);
                        setNewClass({ 
                          name: '', 
                          professorId: '', 
                          description: '',
                          capacity: 30,
                          startDate: '',
                          endDate: ''
                        });
                        setClassDialogOpen(true);
                      }}
                      getProfessorName={getProfessorName}
                    />
                  )}
                  {activeTab === 2 && (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Box
                          sx={{
                            bgcolor: 'rgba(139, 92, 246, 0.1)',
                            p: 4,
                            borderRadius: 4,
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: 600,
                            mx: 'auto'
                          }}
                        >
                          <DataUsage sx={{ fontSize: 60, color: '#8b5cf6', mb: 2 }} />
                          <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: '#8b5cf6' }}>
                            Learning Modules Coming Soon
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                            This feature is currently under development. You'll soon be able to create, manage, and track learning modules for your classes.
                          </Typography>
                          <Button
                            variant="outlined"
                            sx={{
                              borderColor: '#8b5cf6',
                              color: '#8b5cf6',
                              '&:hover': {
                                borderColor: '#7c3aed',
                                bgcolor: 'rgba(139, 92, 246, 0.1)'
                              }
                            }}
                          >
                            Join Beta Program
                          </Button>
                        </Box>
                      </motion.div>
                    </Box>
                  )}
                  {activeTab === 3 && (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Box
                          sx={{
                            bgcolor: 'rgba(6, 182, 212, 0.1)',
                            p: 4,
                            borderRadius: 4,
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: 600,
                            mx: 'auto'
                          }}
                        >
                          <BarChart sx={{ fontSize: 60, color: '#06b6d4', mb: 2 }} />
                          <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: '#06b6d4' }}>
                            Analytics & Reports Coming Soon
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                            Our advanced analytics engine is under construction. Soon you'll gain powerful insights with comprehensive reporting tools.
                          </Typography>
                          <Button
                            variant="outlined"
                            sx={{
                              borderColor: '#06b6d4',
                              color: '#06b6d4',
                              '&:hover': {
                                borderColor: '#0891b2',
                                bgcolor: 'rgba(6, 182, 212, 0.1)'
                              }
                            }}
                          >
                            Request Early Access
                          </Button>
                        </Box>
                      </motion.div>
                    </Box>
                  )}
                  {activeTab === 4 && (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Box
                          sx={{
                            bgcolor: 'rgba(249, 115, 22, 0.1)',
                            p: 4,
                            borderRadius: 4,
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: 600,
                            mx: 'auto'
                          }}
                        >
                          <Settings sx={{ fontSize: 60, color: '#f97316', mb: 2 }} />
                          <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: '#f97316' }}>
                            System Settings Coming Soon
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                            Advanced configuration options will be available soon. Customize notifications, user permissions, and platform behavior.
                          </Typography>
                          <Button
                            variant="outlined"
                            sx={{
                              borderColor: '#f97316',
                              color: '#f97316',
                              '&:hover': {
                                borderColor: '#ea580c',
                                bgcolor: 'rgba(249, 115, 22, 0.1)'
                              }
                            }}
                          >
                            Suggest Features
                          </Button>
                        </Box>
                      </motion.div>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile actions bar */}
          {isMobile && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Paper
                elevation={4}
                sx={{
                  position: 'fixed',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'auto',
                  borderRadius: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 1,
                  gap: 2,
                  zIndex: 1000,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Tooltip title="Refresh Data">
                  <IconButton
                    onClick={refreshData}
                    disabled={refreshing}
                  >
                    <Refresh sx={{ color: theme.palette.primary.main }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add User">
                  <IconButton
                    onClick={() => {
                      setSelectedUser(null);
                      setNewUser({ name: '', prenom: '', password: '', email: '', role: '' });
                      setUserDialogOpen(true);
                    }}
                    sx={{ bgcolor: theme.palette.primary.main, color: 'white', '&:hover': { bgcolor: theme.palette.primary.dark } }}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
                <Tooltip title="System Settings">
                  <IconButton>
                    <Settings sx={{ color: theme.palette.text.secondary }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Notifications">
                  <IconButton sx={{ position: 'relative' }}>
                    <Notifications sx={{ color: theme.palette.text.secondary }} />
                    {stats.pendingRequests > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 12,
                          height: 12,
                          bgcolor: theme.palette.error.main,
                          borderRadius: '50%',
                          border: '2px solid white'
                        }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              </Paper>
            </motion.div>
          )}

          {/* Enhanced User Dialog with improved form layout */}
          <UserDialog
            open={userDialogOpen}
            onClose={() => setUserDialogOpen(false)}
            selectedUser={selectedUser}
            newUser={newUser}
            onUserChange={handleUserChange}
            onSubmit={selectedUser ? updateUser : createUser}
            professors={professors}
          />
          
          {/* Enhanced Class Dialog with additional fields */}
          <ClassDialog
            open={classDialogOpen}
            onClose={() => setClassDialogOpen(false)}
            selectedClass={selectedClass}
            newClass={newClass}
            onClassChange={handleClassChange}
            onSubmit={selectedClass ? updateClass : createClass}
            professors={professors}
          />
          
          {/* Styled Confirm Dialog */}
          <ConfirmDialog
            open={confirmDialog.open}
            onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            title={confirmDialog.title}
            message={confirmDialog.message}
            onConfirm={confirmDialog.onConfirm}
          />

          {/* Snackbar notifications with transitions */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            TransitionComponent={Fade}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbar.severity}
              elevation={6}
              variant="filled"
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                width: '100%',
                '& .MuiAlert-icon': {
                  fontSize: '1.2rem'
                }
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
          
          {/* Footer */}
          <Box
            component={motion.footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            sx={{
              mt: 8,
              py: 3,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, md: 0 } }}>
              © {new Date().getFullYear()} Nexus Academy. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                Privacy Policy
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                Terms of Service
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                Support
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </DashboardContainer>
    </ThemeProvider>
  );
}

export default AdminHome;