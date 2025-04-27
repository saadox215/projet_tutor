import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, FiBook, FiBarChart, FiSettings, FiRefreshCw, FiBell, 
  FiPlus, FiGrid, FiAlertCircle, FiMenu, FiX, FiUserPlus 
} from 'react-icons/fi';
import UserTable from './UserTable';
import ClassTable from './ClassTable';
import UserDialog from './UserDialog';
import ClassDialog from './ClassDialog';
import ConfirmDialog from './ConfirmDialog';

const Sidebar = memo(({ activeTab, setActiveTab }) => (
  <motion.div
    className="bg-gray-900 text-white w-64 h-screen fixed top-0 left-0 p-6 flex flex-col z-50"
    initial={{ x: -300 }}
    animate={{ x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h1 className="text-2xl font-bold mb-8">Nexus Admin</h1>
    <nav className="flex-1">
      {[
        { id: 'users', label: 'Users', icon: <FiUsers /> },
        { id: 'classes', label: 'Classes', icon: <FiBook /> },
        { id: 'reports', label: 'Reports', icon: <FiBarChart />, disabled: true },
        { id: 'settings', label: 'Settings', icon: <FiSettings />, disabled: true },
      ].map(item => (
        <button
          key={item.id}
          onClick={() => !item.disabled && setActiveTab(item.id)}
          className={`flex items-center w-full p-3 mb-2 rounded-lg text-left ${
            activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'
          } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={item.disabled}
        >
          <span className="mr-3">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  </motion.div>
));

const AssignStudentDialog = ({ open, onClose, classes, onAssign, selectedStudent }) => (
  open ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Assign Student to Class</h2>
        <p className="mb-4">
          Assigning student: <strong>{selectedStudent?.name} {selectedStudent?.prenom}</strong>
        </p>
        
        {selectedStudent?.classeId && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg">
            <FiAlertCircle className="inline mr-2" />
            This student is already assigned to class: <strong>{selectedStudent.classeName}</strong>
            <p className="text-sm mt-1">Assigning to a new class will move them from their current class.</p>
          </div>
        )}
        
        <select
          onChange={(e) => onAssign(selectedStudent.id, e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-3"
        >
          <option value="">Select a Class</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200">Cancel</button>
        </div>
      </div>
    </div>
  ) : null
);

const AdminHome = () => {
  const [activeTab, setActiveTab] = useState('users');
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
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  
  const [newUser, setNewUser] = useState({
    name: '',
    prenom: '',
    password: '',
    email: '',
    role: '',
  });
  
  const [newClass, setNewClass] = useState({
    name: '',
    professorId: '',
    description: '',
    capacity: 30,
    startDate: '',
    endDate: '',
  });

  const API_BASE_URL = 'http://localhost:8081/api/admin';
  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token]);

  const professors = useMemo(() => users.filter(user => user.role === 'PROFESSEUR'), [users]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/stats`, { headers });
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats({
        ...data,
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
      
      const enhancedData = data.map(user => ({
        ...user,
        classeId: user.classe?.id,
        classeName: user.classe?.name
      }));
      
      setUsers(enhancedData);
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
      setNewClass({ name: '', professorId: '', description: '', capacity: 30, startDate: '', endDate: '' });
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
      setNewClass({ name: '', professorId: '', description: '', capacity: 30, startDate: '', endDate: '' });
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

  const assignStudentToClass = useCallback(async (studentId, classId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/classes/add-student?studentId=${studentId}&classId=${classId}`, {
        method: 'POST',
        headers,
      });
      
      if (!response.ok) {
        const errorMessage = await response.text(); 
        if (errorMessage.includes("déjà affecté")) {
          throw new Error("This student is already assigned to a class.");
        }
        throw new Error(errorMessage || 'Failed to assign student to class');
      }
      
      const message = await response.text(); 
      setAssignDialogOpen(false);
      setSelectedStudent(null);
      showSnackbar(message, 'success');
      await Promise.all([fetchClasses(), fetchUsers()]); // Refresh both
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [headers, fetchClasses, fetchUsers]);

  

  const handleAssignStudent = useCallback((student) => {
    if (student.role !== 'ETUDIANT') {
      showSnackbar('Only students can be assigned to classes', 'error');
      return;
    }
    
    // Check if student is already assigned to a class
    const studentWithClass = users.find(u => u.id === student.id && u.classeId);
    if (studentWithClass) {
      showSnackbar(`This student is already assigned to ${studentWithClass.classeName || 'a class'}`, 'warning');
    }
    
    setSelectedStudent(student);
    setAssignDialogOpen(true);
  }, [users]);

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

  // Utility Functions
  const getProfessorName = useCallback((id) => {
    const professor = users.find(user => user.id === id && user.role === 'PROFESSEUR');
    return professor ? `${professor.name} ${professor.prenom}` : 'Not Assigned';
  }, [users]);

  const getRoleColor = useCallback((role) => {
    switch (role) {
      case 'ETUDIANT': return 'text-green-600';
      case 'PROFESSEUR': return 'text-blue-600';
      case 'ADMIN': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }, []);

  const getRoleIcon = useCallback((role) => {
    switch (role) {
      case 'ETUDIANT': return <FiBook className="inline mr-1" />;
      case 'PROFESSEUR': return <FiUsers className="inline mr-1" />;
      case 'ADMIN': return <FiGrid className="inline mr-1" />;
      default: return <FiUsers className="inline mr-1" />;
    }
  }, []);

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
        password: '',
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
    setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 5000);
  }, []);
  const removeStudentFromClass = useCallback(async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/students/${userId}/removeFromClass`, {
        method: 'PUT',
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove student from class');
      }
      
      // Update the users state with the updated user data
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId 
          ? { ...user, classeId: null, classe: null, classeName: null } 
          : user
      ));
      
      // Show success message via the snackbar instead of alert
      showSnackbar('Student removed from class successfully', 'success');
      fetchStats(); // Refresh stats to update class count
    } catch (error) {
      console.error('Error removing student from class:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  }, [API_BASE_URL, headers, showSnackbar, fetchStats]);
  
  const handleRemoveFromClass = useCallback((userId, studentName) => {
    setConfirmDialog({
      open: true,
      title: 'Remove Student from Class',
      message: `Are you sure you want to remove ${studentName} from their current class? This action cannot be undone.`,
      onConfirm: () => removeStudentFromClass(userId),
    });
  }, [removeStudentFromClass]);
  const StatCard = ({ title, value, icon, color }) => (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  useEffect(() => {
    Promise.all([fetchStats(), fetchUsers(), fetchClasses()])
      .catch(err => setError(err.message));
  }, [fetchStats, fetchUsers, fetchClasses]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64 p-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500">Manage your educational ecosystem efficiently</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50"
              >
                <FiRefreshCw className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="relative">
                <FiBell className="text-gray-600" />
                {stats.pendingRequests > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {stats.pendingRequests}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FiAlertCircle className="mr-2" />
            {error}
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<FiUsers size={24} />}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Students"
            value={stats.totalStudents}
            icon={<FiBook size={24} />}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Classes"
            value={stats.totalClasses}
            icon={<FiGrid size={24} />}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            title="Professors"
            value={stats.totalProfessors}
            icon={<FiUsers size={24} />}
            color="bg-purple-100 text-purple-600"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'users' && (
                <UserTable
                  users={users}
                  searchTerm={searchTerm}
                  selectedRole={selectedRole}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleEditUser={handleEditUser}
                  handleDeleteUser={handleDeleteUser}
                  handleAssignStudent={handleAssignStudent}
                  removeStudentFromClass={removeStudentFromClass} // Pass the new function
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
              {activeTab === 'classes' && (
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
              {activeTab === 'reports' && (
                <div className="text-center py-16">
                  <FiBarChart size={48} className="mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900">Reports Coming Soon</h2>
                  <p className="text-gray-500 mt-2">Advanced analytics and reporting features are under development.</p>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="text-center py-16">
                  <FiSettings size={48} className="mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900">Settings Coming Soon</h2>
                  <p className="text-gray-500 mt-2">Customize platform settings and permissions in the future.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <UserDialog
          open={userDialogOpen}
          onClose={() => setUserDialogOpen(false)}
          selectedUser={selectedUser}
          newUser={newUser}
          onUserChange={handleUserChange}
          onSubmit={selectedUser ? updateUser : createUser}
          professors={professors}
        />
        
        <ClassDialog
          open={classDialogOpen}
          onClose={() => setClassDialogOpen(false)}
          selectedClass={selectedClass}
          newClass={newClass}
          onClassChange={handleClassChange}
          onSubmit={selectedClass ? updateClass : createClass}
          professors={professors}
        />
        
        <ConfirmDialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
        />

        <AssignStudentDialog
          open={assignDialogOpen}
          onClose={() => {
            setAssignDialogOpen(false);
            setSelectedStudent(null);
          }}
          classes={classes}
          onAssign={assignStudentToClass}
          selectedStudent={selectedStudent}
        />

        {snackbar.open && (
          <motion.div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
              snackbar.severity === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            {snackbar.message}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;