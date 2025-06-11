import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  PlusCircle, 
  X, 
  Trash2, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  LogOut, 
  Paperclip,
  ExternalLink,
  Check,
  Edit,
  Save,
  Calendar,
  Clock,
  Info,
  AlertTriangle,
  Book,
  BookOpen,
  Layers,
  Users,
  Award,
  Bookmark,
  CheckCircle,
  FileSymlink,
  Download,
  Eye,
  BarChart,
  PenTool,
  Archive
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/prof';

// Custom fetch function that includes JWT token from localStorage
const authorizedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Authorization': `Bearer ${token}`
  };
  
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {})
  };
  
  const newOptions = {
    ...options,
    headers
  };
  
  const response = await fetch(url, newOptions);
  
  if (response.status === 401) {
    toast.error('Session expired, please log in again');
    localStorage.clear();
    window.location.reload();
  }
  
  return response;
};

// Toast component
const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const bgColor = type === 'success' ? 'bg-green-500' : 
                 type === 'error' ? 'bg-red-500' : 
                 type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white p-3 sm:p-4 rounded-lg shadow-lg flex items-center z-50 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {type === 'success' && <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />}
      {type === 'error' && <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />}
      {type === 'warning' && <Info className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />}
      {type === 'info' && <Info className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />}
      <p className="text-sm sm:text-base">{message}</p>
      <button 
        onClick={onClose} 
        className="ml-3 sm:ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
      >
        <X className="w-3 sm:w-4 h-3 sm:h-4" />
      </button>
    </div>
  );
};

// Toast notification system
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  
  window.toast = {
    success: (message) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type: 'success' }]);
    },
    error: (message) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type: 'error' }]);
    },
    warning: (message) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type: 'warning' }]);
    },
    info: (message) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type: 'info' }]);
    }
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <>
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </>
  );
};

const ExerciseManagement = ({ onLogout, userName }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [exercises, setExercises] = useState([]);
  const [exerciseForm, setExerciseForm] = useState({
    titre: '',
    description: '',
    dateLimite: '',
  });
  const [showArchived, setShowArchived] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [fileUrlDialogOpen, setFileUrlDialogOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);
  const [deleteExerciseDialogOpen, setDeleteExerciseDialogOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [editExerciseId, setEditExerciseId] = useState(null);
  const [editForm, setEditForm] = useState({
    titre: '',
    description: '',
    dateLimite: '',
  });
  const [showStudentSubmissions, setShowStudentSubmissions] = useState(false);
  const [currentSubmissions, setCurrentSubmissions] = useState([]);
  const [stats, setStats] = useState({
    totalExercises: 0,
    completedExercises: 0,
    pendingExercises: 0,
    upcomingExercises: 0
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if

 (selectedClassId) {
      fetchExercisesByClassId(selectedClassId);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (exercises.length > 0) {
      updateStats();
    }
  }, [exercises]);

  const updateStats = () => {
    const now = new Date();
    const completed = exercises.filter(ex => new Date(ex.dateLimite) < now).length;
    const pending = exercises.filter(ex => {
      const deadline = new Date(ex.dateLimite);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return deadline >= now && deadline <= weekFromNow;
    }).length;
    const upcoming = exercises.filter(ex => {
      const deadline = new Date(ex.dateLimite);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return deadline > weekFromNow;
    })?.length;

    setStats({
      totalExercises: exercises.length,
      completedExercises: completed,
      pendingExercises: pending,
      upcomingExercises: upcoming
    });
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await authorizedFetch(`${API_BASE_URL}/annonces/professeur/classes`);
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      window.toast.error('Unable to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchExercisesByClassId = async (classId) => {
    try {
      setLoading(true);
      const response = await authorizedFetch(`${API_BASE_URL}/exercices/classe/${classId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      window.toast.error('Unable to fetch exercises');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExerciseForm({
      ...exerciseForm,
      [name]: value,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const isExpired = (dateLimite) => {
    return new Date(dateLimite) < new Date();
  };

  const getStatusBadge = (dateLimite) => {
    const deadline = new Date(dateLimite);
    const now = new Date();
    const diff = Math.floor((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) {
      return (
        <span className="flex items-center px-2 sm:px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          <AlertTriangle className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          Completed
        </span>
      );
    } else if (diff < 3) {
      return (
        <span className="flex items-center px-2 sm:px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
          <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          Urgent
        </span>
      );
    } else if (diff < 7) {
      return (
        <span className="flex items-center px-2 sm:px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          <Info className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          This Week
        </span>
      );
    } else {
      return (
        <span className="flex items-center px-2 sm:px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          <Check className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          Upcoming
        </span>
      );
    }
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    if (!selectedClassId) {
      window.toast.warning('Please select a class');
      return;
    }
    
    if (!exerciseForm.titre || !exerciseForm.description || !exerciseForm.dateLimite) {
      window.toast.warning('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      const response = await authorizedFetch(`${API_BASE_URL}/exercices?classeId=${selectedClassId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exerciseForm)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create exercise');
      }
      
      const newExercise = await response.json();
      
      if (selectedFiles.length > 0) {
        await uploadFiles(newExercise.id);
      }
      
      fetchExercisesByClassId(selectedClassId);
      
      setExerciseForm({
        titre: '',
        description: '',
        dateLimite: '',
      });
      
      setSelectedFiles([]);
      window.toast.success('Exercise created successfully');
    } catch (error) {
      console.error('Error creating exercise:', error);
      window.toast.error('Error creating exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveExercise = async (exerciseId) => {
    try {
      setLoading(true);
      const response = await authorizedFetch(`${API_BASE_URL}/exercices/archiver/${exerciseId}`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to archive exercise');
      }
      fetchExercisesByClassId(selectedClassId);
      window.toast.success('Exercise archived successfully');
    } catch (error) {
      console.error('Error archiving exercise:', error);
      window.toast.error('Error archiving exercise');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDearchiveExercise = async (exerciseId) => {
    try {
      setLoading(true);
      const response = await authorizedFetch(`${API_BASE_URL}/exercices/dearchiver/${exerciseId}`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to dearchive exercise');
      }
      fetchExercisesByClassId(selectedClassId);
      window.toast.success('Exercise dearchived successfully');
    } catch (error) {
      console.error('Error dearchiving exercise:', error);
      window.toast.error('Error dearchiving exercise');
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (exerciseId) => {
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await authorizedFetch(
          `${API_BASE_URL}/exercices/${exerciseId}/fichiers`,
          {
            method: 'POST',
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to upload file ${file.name}`);
        }
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        window.toast.error(`Error uploading file ${file.name}`);
      }
    }
  };

  const handleAddFilesToExercise = async (e, exerciseId) => {
    e.preventDefault();
    if (!selectedFiles.length) {
      window.toast.warning('Please select files');
      return;
    }
    try {
      setLoading(true);
      await uploadFiles(exerciseId);
      fetchExercisesByClassId(selectedClassId);
      setSelectedFiles([]);
      setSelectedExercise(null);
      window.toast.success('Files added successfully');
    } catch (error) {
      console.error('Error adding files:', error);
      window.toast.error('Error adding files');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteFileDialog = (fileId) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteFileDialog = () => {
    setFileToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    try {
      setLoading(true);
      const response = await authorizedFetch(
        `${API_BASE_URL}/exercices/fichiers/${fileToDelete}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      fetchExercisesByClassId(selectedClassId);
      window.toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      window.toast.error('Error deleting file');
    } finally {
      setLoading(false);
      closeDeleteFileDialog();
    }
  };

  const openDeleteExerciseDialog = (exerciseId) => {
    setExerciseToDelete(exerciseId);
    setDeleteExerciseDialogOpen(true);
  };

  const closeDeleteExerciseDialog = () => {
    setExerciseToDelete(null);
    setDeleteExerciseDialogOpen(false);
  };

  const handleDeleteExercise = async () => {
    if (!exerciseToDelete) return;
    try {
      setLoading(true);
      const response = await authorizedFetch(
        `${API_BASE_URL}/exercices/${exerciseToDelete}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error('Failed to delete exercise');
      }
      fetchExercisesByClassId(selectedClassId);
      window.toast.success('Exercise deleted successfully');
    } catch (error) {
      console.error('Error deleting exercise:', error);
      window.toast.error('Error deleting exercise');
    } finally {
      setLoading(false);
      closeDeleteExerciseDialog();
    }
  };

  const handleEditExercise = (exercise) => {
    setEditExerciseId(exercise.id);
    setEditForm({
      titre: exercise.titre,
      description: exercise.description,
      dateLimite: exercise.dateLimite.slice(0, 16)
    });
  };

  const handleCancelEdit = () => {
    setEditExerciseId(null);
    setEditForm({
      titre: '',
      description: '',
      dateLimite: ''
    });
  };

  const handleUpdateExercise = async (exerciseId) => {
    if (!editForm.titre || !editForm.description || !editForm.dateLimite) {
      window.toast.warning('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await authorizedFetch(`${API_BASE_URL}/exercices/${exerciseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update exercise');
      }

      fetchExercisesByClassId(selectedClassId);
      setEditExerciseId(null);
      window.toast.success('Exercise updated successfully');
    } catch (error) {
      console.error('Error updating exercise:', error);
      window.toast.error('Error updating exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = (file) => {
    setSelectedFileUrl(file.url);
    setFileUrlDialogOpen(true);
  };

  const closeFileUrlDialog = () => {
    setSelectedFileUrl('');
    setFileUrlDialogOpen(false);
  };

  const toggleExerciseExpand = (id) => {
    setExpandedExerciseId(expandedExerciseId === id ? null : id);
  };

  const mockSubmissions = [
    { id: 1, studentName: 'Emma Martin', submittedAt: '2025-04-30T10:15:00', status: 'submitted', grade: null },
    { id: 2, studentName: 'Lucas Dubois', submittedAt: '2025-04-29T16:42:00', status: 'graded', grade: 17 },
    { id: 3, studentName: 'Sarah Legrand', submittedAt: '2025-04-28T09:05:00', status: 'graded', grade: 15 },
    { id: 4, studentName: 'Thomas Petit', submittedAt: null, status: 'no_submitted', grade: null }
  ];

  const viewSubmissions = (exerciseId) => {
    setCurrentSubmissions(mockSubmissions);
    setShowStudentSubmissions(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-150 to-purple-200">
      <ToastContainer />
      
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-md w-full mx-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Are you sure you want to delete this file? This action is irreversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteFileDialog}
                className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFile}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteExerciseDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="bg-red-50 p-3 rounded-lg mb-4">
              <AlertTriangle className="h-6 sm:h-8 w-6 sm:w-8 text-red-600 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">Confirm Deletion</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6 text-center">
              Are you sure you want to delete this exercise? All associated files and student submissions will also be deleted.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={closeDeleteExerciseDialog}
                className="px-4 sm:px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteExercise}
                className="px-4 sm:px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm sm:text-base font-medium"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {fileUrlDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Download File</h3>
              <button
                onClick={closeFileUrlDialog}
                className="p-1 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-full transition duration-200"
              >
                <X className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              You can download the file by clicking the link below:
            </p>
            <div className="bg-[rgb(107,33,243)] bg-opacity-10 p-3 sm:p-4 rounded-lg mb-4">
              <a
                href={selectedFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[rgb(122,7,180)] hover:text-[rgb(100,11,113)] transition duration-200 text-sm sm:text-base"
              >
                <Download className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                <span className="underline">Download File</span>
                <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4 ml-2" />
              </a>
            </div>
            <button
              onClick={closeFileUrlDialog}
              className="w-full px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showStudentSubmissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Student Submissions</h3>
              <button
                onClick={() => setShowStudentSubmissions(false)}
                className="p-1 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-full transition duration-200"
              >
                <X className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
            
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 mb-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-green-500"></div>
                <span className="text-xs sm:text-sm font-medium">Submitted: {currentSubmissions.filter(s => s.status === 'submitted' || s.status === 'graded').length}</span>
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-500"></div>
                <span className="text-xs sm:text-sm font-medium">Not Submitted: {currentSubmissions.filter(s => s.status === 'not_submitted').length}</span>
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs sm:text-sm font-medium">Graded: {currentSubmissions.filter(s => s.status === 'graded').length}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student</th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Grade</th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentSubmissions.map(submission => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900">{submission.studentName}</td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm">
                        {submission.status === 'submitted' && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Submitted
                          </span>
                        )}
                        {submission.status === 'not_submitted' && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Not Submitted
                          </span>
                        )}
                        {submission.status === 'graded' && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Graded
                          </span>
                        )}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-500">
                        {submission.submittedAt ? formatDate(submission.submittedAt) : '-'}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-500">
                        {submission.grade !== null ? `${submission.grade}/20` : '-'}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm">
                        <div className="flex space-x-2">
                          {submission.status !== 'not_submitted' && (
                            <button className="p-1 text-[rgb(122,7,180)] hover:bg-[rgb(107,33,243)] hover:bg-opacity-10 rounded transition-colors">
                              <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                            </button>
                          )}
                          {submission.status === 'submitted' && (
                            <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors">
                              <PenTool className="w-3 sm:w-4 h-3 sm:h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 sm:mt-6 flex justify-end">
              <button
                onClick={() => setShowStudentSubmissions(false)}
                className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <BookOpen className="h-6 sm:h-8 w-6 sm:w-8 text-[rgb(122,7,180)] mr-2 sm:mr-3" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Exercise Management</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Exercises</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalExercises}</h3>
              </div>
              <div className="bg-[rgb(107,33,243)] bg-opacity-20 p-2 sm:p-3 rounded-full">
                <Layers className="h-5 sm:h-6 w-5 sm:w-6 text-[rgb(122,7,180)]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Completed Exercises</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.completedExercises}</h3>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <CheckCircle className="h-5 sm:h-6 w-5 sm:w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Due Soon</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pendingExercises}</h3>
              </div>
              <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
                <Clock className="h-5 sm:h-6 w-5 sm:w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Upcoming</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.upcomingExercises}</h3>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                <Calendar className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <PlusCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-[rgb(122,7,180)]" />
                New Exercise
              </h2>
              
              <form onSubmit={handleCreateExercise}>
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="classeId">
                    Class
                  </label>
                  <select
                    id="classeId"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(122,7,180)] focus:border-transparent text-sm sm:text-base"
                    required
                  >
                    <option value="">Select a class</option>
                    {classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>
                        {classe.niveau} - {classe.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="titre">
                    Title
                  </label>
                  <input
                    type="text"
                    id="titre"
                    name="titre"
                    value={exerciseForm.titre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(122,7,180)] focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={exerciseForm.description}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(122,7,180)] focus:border-transparent text-sm sm:text-base"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="dateLimite">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    id="dateLimite"
                    name="dateLimite"
                    value={exerciseForm.dateLimite}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(122,7,180)] focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="files">
                    Files (optional)
                  </label>
                  <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[rgb(122,7,180)] transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <div className="flex justify-center">
                        <Paperclip className="h-8 sm:h-10 w-8 sm:w-10 text-gray-400" />
                      </div>
                      <div className="flex text-xs sm:text-sm text-gray-600">
                        <label
                          htmlFor="files"
                          className="flex items-center justify-center w-full cursor-pointer"
                        >
                          <span className="text-[rgb(122,7,180)] hover:text-[rgb(100,11,113)]">
                            Upload files
                          </span>
                          <input
                            id="files"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, XLS, PPT, etc.</p>
                    </div>
                  </div>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
                    <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between py-2 px-3">
                          <div className="flex items-center">
                            <FileText className="h-3 sm:h-4 w-3 sm:w-4 text-gray-500 mr-2" />
                            <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[150px] sm:max-w-[180px]">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({formatFileSize(file.size)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="h-3 sm:h-4 w-3 sm:w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-3 sm:px-4 py-2 bg-[rgb(122,7,180)] text-white rounded-lg hover:bg-[rgb(100,11,113)] focus:outline-none focus:ring-2 focus:ring-[rgb(122,7,180)] focus:ring-offset-2 transition-colors text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      <PlusCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                      Create Exercise
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Book className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-[rgb(122,7,180)]" />
                {showArchived ? 'Archived Exercise List' : 'Exercise List'}
                {selectedClassId && classes.find(c => c.id === parseInt(selectedClassId)) && (
                  <span className="ml-2 text-xs sm:text-sm font-normal text-gray-500">
                    - {classes.find(c => c.id === parseInt(selectedClassId)).niveau} {classes.find(c => c.id === parseInt(selectedClassId)).name}
                  </span>
                )}
              </h2>
              
              {!selectedClassId ? (
                <div className="text-center py-6 sm:py-8">
                  <Users className="h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Select a Class</h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Please select a class to view its exercises
                  </p>
                </div>
              ) : exercises.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Book className="h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No Exercises</h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {showArchived ? 'No archived exercises for this class' : 'You haven\'t created any exercises for this class yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${expandedExerciseId === exercise.id ? 'bg-[rgb(107,33,243)] bg-opacity-10' : 'bg-white'}`}
                        onClick={() => toggleExerciseExpand(exercise.id)}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <div 
                            className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${isExpired(exercise.dateLimite) ? 'bg-red-400' : 'bg-green-400'}`}
                          ></div>
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">{exercise.titre}</h3>
                          <div className="flex space-x-2">
                            {getStatusBadge(exercise.dateLimite)}
                            {exercise.archived && (
                              <span className="flex items-center px-2 sm:px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                <Archive className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                                Archived
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs sm:text-sm text-gray-500 mr-2 sm:mr-3">
                            {formatDate(exercise.dateLimite)}
                          </span>
                          <div 
                            className={`p-1 rounded-full ${expandedExerciseId === exercise.id ? 'bg-[rgb(107,33,243)] bg-opacity-20' : 'bg-gray-100'}`}
                          >
                            {expandedExerciseId === exercise.id ? (
                              <ChevronUp className={`h-4 sm:h-5 w-4 sm:w-5 ${expandedExerciseId === exercise.id ? 'text-[rgb(122,7,180)]' : 'text-gray-500'}`} />
                            ) : (
                              <ChevronDown className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {expandedExerciseId === exercise.id && (
                        <div className="border-t border-gray-200 px-3 sm:px-4 py-3 sm:py-4 bg-white">
                          {editExerciseId === exercise.id ? (
                            <div className="mb-4">
                              <form>
                                <div className="mb-3">
                                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor={`edit-titre-${exercise.id}`}>
                                    Title
                                  </label>
                                  <input
                                    type="text"
                                    id={`edit-titre-${exercise.id}`}
                                    name="titre"
                                    value={editForm.titre}
                                    onChange={handleEditInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(122,7,180)] focus:border-transparent text-sm sm:text-base"
                                    required
                                  />
                                </div>
                                
                                <div className="mb-3">
                                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor={`edit-description-${exercise.id}`}>
                                    Description
                                  </label>
                                  <textarea
                                    id={`edit-description-${exercise.id}`}
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(122,7,180)] focus:border-transparent text-sm sm:text-base"
                                    required
                                  ></textarea>
                                </div>
                                
                                <div className="mb-4">
                                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor={`edit-dateLimite-${exercise.id}`}>
                                    Deadline
                                  </label>
                                  <input
                                    type="datetime-local"
                                    id={`edit-dateLimite-${exercise.id}`}
                                    name="dateLimite"
                                    value={editForm.dateLimite}
                                    onChange={handleEditInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(122,7,180)] focus:border-transparent text-sm sm:text-base"
                                    required
                                  />
                                </div>
                                
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateExercise(exercise.id)}
                                    className="flex items-center px-3 py-2 bg-[rgb(122,7,180)] text-white rounded-lg hover:bg-[rgb(100,11,113)] transition-colors text-sm sm:text-base"
                                  >
                                    <Save className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                                  >
                                    <X className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          ) : (
                            <>
                              <div className="mb-4">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Description:</h4>
                                <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line">{exercise.description}</p>
                              </div>
                              
                              <div className="mb-4">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Deadline:</h4>
                                <p className="text-gray-600 text-sm sm:text-base flex items-center">
                                  <Calendar className="h-3 sm:h-4 w-3 sm:w-4 mr-1 text-gray-500" />
                                  {formatDate(exercise.dateLimite)}
                                </p>
                              </div>
                            </>
                          )}
                          
                          {exercise.fichiers && exercise.fichiers.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Files:</h4>
                              <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                                {exercise.fichiers.map((file) => (
                                  <li key={file.id} className="flex items-center justify-between py-2 px-3">
                                    <div 
                                      className="flex items-center cursor-pointer hover:text-[rgb(122,7,180)] transition-colors"
                                      onClick={() => handleFileClick(file)}
                                    >
                                      <FileText className="h-3 sm:h-4 w-3 sm:w-4 text-gray-500 mr-2" />
                                      <span className="text-xs sm:text-sm">{file.nom}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => openDeleteFileDialog(file.id)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                    >
                                      <Trash2 className="h-3 sm:h-4 w-3 sm:w-4" />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mb-4">
                            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Add Files:</h4>
                            <div className="flex flex-wrap gap-2">
                              <label
                                htmlFor={`add-files-${exercise.id}`}
                                className="flex items-center justify-center cursor-pointer px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                              >
                                <Paperclip className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                                <span>Select</span>
                                <input
                                  id={`add-files-${exercise.id}`}
                                  type="file"
                                  multiple
                                  onChange={handleFileChange}
                                  className="sr-only"
                                />
                              </label>
                              {selectedFiles.length > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => handleAddFilesToExercise(e, exercise.id)}
                                  className="flex items-center px-3 py-2 bg-[rgb(122,7,180)] text-white rounded-lg hover:bg-[rgb(100,11,113)] transition-colors text-sm sm:text-base"
                                  disabled={loading}
                                >
                                  <PlusCircle className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                                  {loading ? "Adding..." : `Add (${selectedFiles.length})`}
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-4">
                            <button
                              onClick={() => viewSubmissions(exercise.id)}
                              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                            >
                              <Users className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                              Student Submissions
                            </button>
                            
                            <button
                              onClick={() => handleEditExercise(exercise)}
                              className="flex items-center px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base"
                            >
                              <Edit className="h-3 sm:h-4 w-3 sm:h-4 mr-1" />
                              Edit
                            </button>
                            {exercise.archived ? (
                            <button
                              onClick={() => handleDearchiveExercise(exercise.id)}
                              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                            >
                              <Archive className="h-3 sm:h-4 w-3 sm:h-4 mr-1" />
                              Dearchive
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchiveExercise(exercise.id)}
                              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                            >
                              <Archive className="h-3 sm:h-4 w-3 sm:h-4 mr-1" />
                              Archive
                            </button>
                          )}
                            
                            <button
                              onClick={() => openDeleteExerciseDialog(exercise.id)}
                              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                            >
                              <Trash2 className="h-3 sm:h-4 w-3 sm:h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExerciseManagement;