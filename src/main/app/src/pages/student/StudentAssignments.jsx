import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock,
  FileText, 
  Upload,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Filter,
  X,
  Search,
  Download,
  Send,
  PlusCircle,
  BookOpen,
  SortAsc,
  SortDesc
} from 'lucide-react';

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-warning text-neutral'
  }[type] || 'bg-primary text-white';

  return (
    <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${styles} animate-slide-up flex items-center max-w-sm z-50`}>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ClassroomAssignments = () => {
  // State management
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateDue');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Add toast notification
  const addToast = (message, type) => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
  };

  // Remove toast
  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  // Fetch assignments and submissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const exerciseResponse = await fetch('http://localhost:8081/api/etudiant/exercices', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!exerciseResponse.ok) {
          const errorText = await exerciseResponse.text();
          throw new Error(`Error ${exerciseResponse.status}: ${errorText || exerciseResponse.statusText}`);
        }

        const exerciseData = await exerciseResponse.json();

        const submissionResponse = await fetch('http://localhost:8081/api/etudiant/soumissions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!submissionResponse.ok) {
          const errorText = await submissionResponse.text();
          throw new Error(`Error ${submissionResponse.status}: ${errorText || submissionResponse.statusText}`);
        }

        const submissionData = await submissionResponse.json();

        const mergedData = exerciseData.map(exercise => {
          const submission = submissionData.find(sub => sub.exerciceId === exercise.id);
          return {
            ...exercise,
            submissionStatus: submission ? 'submitted' : 'pending',
            submissionDate: submission ? submission.dateSoumission : null,
            grade: submission ? submission.note : null,
            submittedFiles: submission ? submission.fichiers : [],
          };
        });

        setAssignments(mergedData);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  // Check if overdue
  const isOverdue = (dateLimite) => {
    return new Date(dateLimite) < new Date();
  };

  // Calculate remaining time
  const getRemainingTime = (dateLimite) => {
    const now = new Date();
    const deadline = new Date(dateLimite);
    const diff = deadline - now;

    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m remaining`;
    }
  };

  // Get status color
  const getStatusColor = (assignment) => {
    if (assignment.submissionStatus === 'submitted') return 'bg-green-500/10 text-accent';
    if (isOverdue(assignment.dateLimite)) return 'bg-red-500/10 text-danger';
    
    const deadline = new Date(assignment.dateLimite);
    const now = new Date();
    const diff = deadline - now;
    const hoursRemaining = diff / (1000 * 60 * 60);
    
    if (hoursRemaining < 24) return 'bg-warning/10 text-warning';
    return 'bg-primary/10 text-primary';
  };

  // Filter assignments
  const filteredAssignments = assignments
    .filter(assignment => {
      if (filter === 'all') return true;
      if (filter === 'pending') return assignment.submissionStatus === 'pending' && !isOverdue(assignment.dateLimite);
      if (filter === 'submitted') return assignment.submissionStatus === 'submitted';
      if (filter === 'overdue') return isOverdue(assignment.dateLimite) && assignment.submissionStatus === 'pending';
      return true;
    })
    .filter(assignment => {
      if (!searchQuery) return true;
      return (
        assignment.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.professeurNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.classeNom.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Sort assignments
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (sortBy === 'dateDue') {
      return sortDirection === 'asc' 
        ? new Date(a.dateLimite) - new Date(b.dateLimite)
        : new Date(b.dateLimite) - new Date(a.dateLimite);
    }
    if (sortBy === 'datePosted') {
      return sortDirection === 'asc'
        ? new Date(a.datePub) - new Date(b.datePub)
        : new Date(b.datePub) - new Date(a.datePub);
    }
    if (sortBy === 'title') {
      return sortDirection === 'asc'
        ? a.titre.localeCompare(b.titre)
        : b.titre.localeCompare(a.titre);
    }
    return 0;
  });

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const ALLOWED_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        addToast(`File ${file.name} is too large. Maximum size is 10MB.`, 'error');
        return false;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        addToast(`File ${file.name} has an unsupported type.`, 'error');
        return false;
      }
      return true;
    });

    setUploadFiles(validFiles);
  };

  // Handle submission
  const handleSubmit = async () => {
    if (uploadFiles.length === 0 || !selectedAssignment) {
      addToast('Please select at least one file to submit.', 'warning');
      return;
    }
    
    if (submitting) {
      addToast('Submission in progress. Please wait.', 'warning');
      return;
    }

    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const file = uploadFiles[0];

      const createResponse = await fetch(`http://localhost:8081/api/etudiant/soumission/${selectedAssignment.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateSoumission: new Date().toISOString()
        })
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(`Failed to create submission: ${errorText}`);
      }

      const responseData = await createResponse.json();
      const submissionId = responseData.id;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('soumissionId', submissionId);

      const submitResponse = await fetch(`http://localhost:8081/api/etudiant/soumission/${submissionId}/fichiers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || 'Unknown server error';
        } catch {
          errorMessage = errorText || submitResponse.statusText;
        }
        throw new Error(`Error ${submitResponse.status}: ${errorMessage}`);
      }

      const updatedAssignments = assignments.map(a => 
        a.id === selectedAssignment.id 
          ? {
              ...a, 
              submissionStatus: 'submitted', 
              submissionDate: new Date().toISOString(),
              submittedFiles: [{
                nom: file.name,
                taille: file.size,
                contentType: file.type
              }]
            } 
          : a
      );
      setAssignments(updatedAssignments);
      setShowFileUpload(false);
      setUploadFiles([]);
      
      setSelectedAssignment({
        ...selectedAssignment,
        submissionStatus: 'submitted',
        submissionDate: new Date().toISOString(),
        submittedFiles: [{
          nom: file.name,
          taille: file.size,
          contentType: file.type
        }]
      });
      
      addToast('Assignment submitted successfully!', 'success');
    } catch (error) {
      addToast(`Failed to submit assignment: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full animate-fade-in">
          <div className="flex items-center text-danger text-lg">
            <AlertTriangle className="w-6 h-6 mr-3" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  // Detail view
  if (selectedAssignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-primary to-secondary text-white">
            <button 
              onClick={() => setSelectedAssignment(null)}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Assignments
            </button>
          </div>
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-neutral">{selectedAssignment.titre}</h1>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedAssignment)}`}>
                {selectedAssignment.submissionStatus === 'submitted' ? 'Submitted' : getRemainingTime(selectedAssignment.dateLimite)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <div className="text-sm font-medium">Posted</div>
                  <div>{formatDate(selectedAssignment.datePub)}</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <div className="text-sm font-medium">Due Date</div>
                  <div>{formatDate(selectedAssignment.dateLimite)}</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <BookOpen className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <div className="text-sm font-medium">Class</div>
                  <div>{selectedAssignment.classeNom} • {selectedAssignment.professeurNom}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral mb-3">Description</h2>
              <div className="text-gray-700 bg-gray-50 p-6 rounded-xl shadow-inner">
                {selectedAssignment.description || 'No description provided.'}
              </div>
            </div>
            
            {selectedAssignment.fichiers?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral mb-3">Attached Files</h2>
                <div className="space-y-3">
                  {selectedAssignment.fichiers.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-primary/10 transition-colors shadow-sm"
                    >
                      <FileText className="w-5 h-5 text-primary mr-3" />
                      <div className="flex-1">
                        <div className="font-medium text-neutral">{file.nom}</div>
                        <div className="text-sm text-gray-500">{(file.taille / 1024).toFixed(2)} KB • {file.contentType}</div>
                      </div>
                      <Download className="w-5 h-5 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-neutral mb-4">Your Submission</h2>
              
              {selectedAssignment.submissionStatus === 'submitted' ? (
                <div className="bg-green-500/10 border border-accent/20 rounded-xl p-6">
                  <div className="flex items-center text-accent mb-3">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Submitted</span>
                    {selectedAssignment.submissionDate && (
                      <span className="ml-2 text-sm text-accent/80">
                        {formatDate(selectedAssignment.submissionDate)}
                      </span>
                    )}
                  </div>
                  
                  {selectedAssignment.submittedFiles?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-accent/20">
                      <div className="text-sm font-medium text-neutral mb-2">Submitted Files</div>
                      <div className="space-y-2">
                        {selectedAssignment.submittedFiles.map((file, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <FileText className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm">{file.nom}</span>
                            <span className="text-xs text-gray-500 ml-2">({(file.taille / 1024).toFixed(2)} KB)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="mt-4 px-5 py-2 bg-green-500/10 text-accent rounded-lg hover:bg-green-500/20 transition-colors text-sm font-semibold"
                    onClick={() => setShowFileUpload(true)}
                  >
                    Edit Submission
                  </button>
                </div>
              ) : isOverdue(selectedAssignment.dateLimite) ? (
                <div className="bg-red-500/10 border border-danger/20 rounded-xl p-6 text-danger">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">This assignment is overdue</span>
                  </div>
                  <p className="text-sm text-red-500/80">Submissions are no longer accepted for this assignment.</p>
                </div>
              ) : (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                  <div className="flex items-center text-primary mb-3">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{getRemainingTime(selectedAssignment.dateLimite)}</span>
                  </div>
                  
                  {!showFileUpload && (
                    <button 
                      className="mt-3 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                      onClick={() => setShowFileUpload(true)}
                    >
                      Begin Submission
                    </button>
                  )}
                </div>
              )}
              
              {showFileUpload && !isOverdue(selectedAssignment.dateLimite) && (
                <div className="mt-6 border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-neutral">Upload Files</h3>
                    <button 
                      onClick={() => {
                        setShowFileUpload(false);
                        setUploadFiles([]);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOCX, ZIP, PNG, JPG (MAX. 10MB)</p>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  {uploadFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-neutral mb-2">Selected Files</h4>
                      <div className="space-y-2">
                        {uploadFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm truncate max-w-xs">{file.name}</span>
                              <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(2)} KB)</span>
                            </div>
                            <button 
                              onClick={() => {
                                const newFiles = [...uploadFiles];
                                newFiles.splice(index, 1);
                                setUploadFiles(newFiles);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button 
                          className={`px-5 py-2 rounded-lg text-sm font-semibold flex items-center ${
                            submitting 
                              ? 'bg-gray-400 text-white cursor-not-allowed' 
                              : 'bg-primary text-white hover:bg-primary/90'
                          } transition-colors`}
                          onClick={handleSubmit}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Submit Assignment
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-neutral">My Assignments</h1>
              <p className="text-gray-500">ESPoint Classroom</p>
            </div>
            
            <div className="mt-4 md:mt-0 w-full md:w-auto flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full md:w-64 transition-all"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                {['all', 'pending', 'submitted', 'overdue'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-sm font-semibold ${
                      filter === f
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    } transition-colors first:rounded-l-lg last:rounded-r-lg`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            {filteredAssignments.length} {filteredAssignments.length === 1 ? 'assignment' : 'assignments'} {filter !== 'all' ? `(${filter})` : ''}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="dateDue">Due Date</option>
              <option value="datePosted">Posted Date</option>
              <option value="title">Title</option>
            </select>
            
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortDirection === 'asc' ? (
                <SortAsc className="w-4 h-4 text-gray-600" />
              ) : (
                <SortDesc className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        {sortedAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center animate-fade-in">
            <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral mb-2">No assignments found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try a different search term' : filter !== 'all' ? 'Try changing your filters' : 'Check back later for new assignments'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all cursor-pointer overflow-hidden animate-slide-up"
                onClick={() => setSelectedAssignment(assignment)}
              >
                <div 
                  className={`h-2 ${
                    assignment.submissionStatus === 'submitted' 
                      ? 'bg-green-500' 
                      : isOverdue(assignment.dateLimite) 
                        ? 'bg-red-500' 
                        : 'bg-blue-500'
                  }`}
                />
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(assignment)}`}>
                      {assignment.submissionStatus === 'submitted' 
                        ? 'Submitted' 
                        : isOverdue(assignment.dateLimite) 
                          ? 'Overdue' 
                          : getRemainingTime(assignment.dateLimite)}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-neutral mb-2 line-clamp-1">
                    {assignment.titre}
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                    {assignment.description || 'No description provided.'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      <span>Due {formatDate(assignment.dateLimite)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      <span>{assignment.fichiers.length} {assignment.fichiers.length === 1 ? 'file' : 'files'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {assignment.classeNom} • {assignment.professeurNom}
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ClassroomAssignments;