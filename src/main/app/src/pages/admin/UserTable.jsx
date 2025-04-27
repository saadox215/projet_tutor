import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEdit2, FiTrash2, FiPlus, FiUserPlus, FiSearch, 
  FiFilter, FiUsers, FiBook, FiGrid, FiX
} from 'react-icons/fi';

const UserTable = ({
  users,
  searchTerm,
  selectedRole,
  page,
  rowsPerPage,
  handleEditUser,
  handleDeleteUser,
  handleAssignStudent,
  removeStudentFromClass,
  setSearchTerm,
  setSelectedRole,
  setPage,
  setRowsPerPage,
  handleOpenUserDialog,
  getRoleColor,
  getRoleIcon
}) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Filter and paginate users
  useEffect(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(search) || 
        user.prenom.toLowerCase().includes(search) || 
        user.email.toLowerCase().includes(search)
      );
    }
    
    // Apply role filter
    if (selectedRole) {
      result = result.filter(user => user.role === selectedRole);
    }
    
    setTotalUsers(result.length);
    
    // Apply pagination
    result = result.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    
    setFilteredUsers(result);
  }, [users, searchTerm, selectedRole, page, rowsPerPage]);
  
  // Handle pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };
  const handleRemoveStudentFromClass = async (userId) => {
    try {
      // Make an API call to remove the student from their class
      const response = await fetch(`/api/admin/students/${userId}/removeFromClass`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove student from class');
      }
      
      // Refresh the user data after successful removal
      // You might need to update this to match how you refresh your user list
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return { ...user, classId: null, classe: null };
        }
        return user;
      });
      
      // Update your state with the updated users
      // This depends on how your component is structured
      setUsers(updatedUsers);
      
      // Show a success message
      alert('Student removed from class successfully');
    } catch (error) {
      console.error('Error removing student from class:', error);
      alert('Failed to remove student from class');
    }
  };
  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / rowsPerPage);
  
  
  // Render role badge with class information for students
  const renderRoleWithClass = (user) => {
    return (
      <div className="flex flex-col">
        <span className={`font-medium ${getRoleColor(user.role)}`}>
          {getRoleIcon(user.role)} {user.role}
        </span>
        {user.role === 'ETUDIANT' && renderClassInfo(user)}
      </div>
    );
  };
  
  const renderClassInfo = (user) => {
    // Check for class using the properties that exist in your UserDTO
    const hasClass = user.classe;
    
    console.log('Class info for user:', {
      id: user.id,
      name: `${user.name} ${user.prenom}`,
      classe: user.classe
    });
    
    if (hasClass) {
      const className = user.classe || `Class ID: ${user.classId}`;
      
      return (
        <div className="flex items-center mt-1">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
            {className}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeStudentFromClass(user.id);
              }}
              className="ml-1 text-blue-800 hover:text-red-600"
              title="Remove from class"
              aria-label="Remove student from class"
            >
              <FiX size={14} />
            </button>
          </span>
        </div>
      );
    } else {
      return <span className="text-gray-400 italic text-xs mt-1">Not assigned</span>;
    }
  };
     
  
  console.log('Users with their class data:', users.map(user => ({
    id: user.id,
    name: `${user.name} ${user.prenom}`,
    role: user.role,
    classeId: user.classeId,
    classeName: user.classeName,
    classe: user.classe
  })));
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Users Management</h2>
        <button
          onClick={handleOpenUserDialog}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" /> Add User
        </button>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Role Filter */}
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setPage(0);
            }}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="PROFESSEUR">Professor</option>
            <option value="ETUDIANT">Student</option>
          </select>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm font-semibold uppercase">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                  onClick={() => handleEditUser(user)}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{user.name} {user.prenom}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    {renderRoleWithClass(user)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      {user.role === 'ETUDIANT' && !(user.classeId || user.classe) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignStudent(user);
                          }}
                          className="p-1 text-green-600 hover:text-green-900 hover:bg-green-100 rounded"
                          title="Assign to class"
                        >
                          <FiUserPlus size={18} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUser(user);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded"
                        title="Edit user"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user.id);
                        }}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded"
                        title="Delete user"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  {searchTerm || selectedRole ? (
                    <div>
                      <p className="mb-2">No users match your search criteria.</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedRole('');
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">No users found.</p>
                      <button 
                        onClick={handleOpenUserDialog}
                        className="text-blue-600 hover:underline flex items-center justify-center mx-auto"
                      >
                        <FiPlus className="mr-1" /> Add a user
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalUsers)} of {totalUsers} users
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {[5, 10, 25, 50].map((value) => (
                <option key={value} value={value}>
                  {value} per page
                </option>
              ))}
            </select>
            <div className="flex space-x-1">
              <button
                onClick={() => handleChangePage(0)}
                disabled={page === 0}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                First
              </button>
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded">
                {page + 1}
              </span>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => handleChangePage(totalPages - 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;