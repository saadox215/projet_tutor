import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEdit2, FiTrash2, FiPlus, FiSearch, 
  FiFilter, FiUsers, FiBook, FiGrid
} from 'react-icons/fi';

const ClassTable = ({
  classes,
  searchTerm,
  page,
  rowsPerPage,
  handleEditClass,
  handleDeleteClass,
  setSearchTerm,
  setPage,
  setRowsPerPage,
  handleOpenClassDialog,
  getProfessorName // Optional, may not be needed if using professorNames
}) => {
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  
  // Filter and paginate classes
  useEffect(() => {
    let result = [...classes];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(classObj => 
        classObj.name.toLowerCase().includes(search) ||
        (classObj.professorNames && classObj.professorNames.some(name => name.toLowerCase().includes(search)))
      );
    }
    
    setTotalClasses(result.length);
    
    // Apply pagination
    result = result.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    
    setFilteredClasses(result);
  }, [classes, searchTerm, page, rowsPerPage]);
  
  // Handle pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(totalClasses / rowsPerPage);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Classes Management</h2>
        <button
          onClick={handleOpenClassDialog}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" /> Add Class
        </button>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search classes or professors..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Classes Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm font-semibold uppercase">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Class Name</th>
              <th className="px-4 py-3 text-left">Professors</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classObj) => (
                <motion.tr
                  key={classObj.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                  onClick={() => handleEditClass(classObj)}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{classObj.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{classObj.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {classObj.professorNames && classObj.professorNames.length > 0 ? (
                        classObj.professorNames.map((name, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded inline-flex items-center"
                          >
                            <FiUsers className="mr-1" /> {name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">No professors assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClass(classObj);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded"
                        title="Edit class"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClass(classObj.id);
                        }}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded"
                        title="Delete class"
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
                  {searchTerm ? (
                    <div>
                      <p className="mb-2">No classes match your search criteria.</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">No classes found.</p>
                      <button 
                        onClick={handleOpenClassDialog}
                        className="text-blue-600 hover:underline flex items-center justify-center mx-auto"
                      >
                        <FiPlus className="mr-1" /> Add a class
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
      {filteredClasses.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalClasses)} of {totalClasses} classes
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

export default ClassTable;