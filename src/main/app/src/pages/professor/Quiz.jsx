import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  AcademicCapIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ClockIcon,
  EyeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  LightBulbIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const QcmPage = () => {
  const [qcms, setQcms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [qcmToDelete, setQcmToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [expandedQcm, setExpandedQcm] = useState(null);
  const [currentView, setCurrentView] = useState("grid");
  const [animateCards, setAnimateCards] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form state for QCM
  const [formData, setFormData] = useState({
    titre: "",
    dateCreation: new Date().toISOString().split('T')[0],
    questions: [{ 
      contenu: "", 
      reponses: [
        { contenu: "", correcte: false },
        { contenu: "", correcte: false }
      ]
    }]
  });

  // Effects for initial data loading
  useEffect(() => {
    fetchQcms();
    fetchClasses();
    
    // Trigger card animation after initial load
    setTimeout(() => {
      setAnimateCards(true);
    }, 500);
  }, []);

  // Fetch QCMs from the API
  const fetchQcms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Assuming there's an endpoint for fetching QCMs by professor
      const response = await fetch("http://localhost:8081/api/prof/evaluation/qcms", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch QCMs");
      }
      
      const data = await response.json();
      setQcms(data);
      console.log(data)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching QCMs:", error);
      setLoading(false);
      // Use dummy data for development if needed
      setQcms([
        {
          id: 1,
          titre: "Introduction to Java",
          dateCreation: "2025-05-01T10:00:00",
          classeId: 1,
          questions: [
            {
              id: 1,
              contenu: "What is Java?",
              reponses: [
                { id: 1, contenu: "A programming language", correcte: true },
                { id: 2, contenu: "A coffee type", correcte: false },
                { id: 3, contenu: "An island", correcte: false }
              ]
            },
            {
              id: 2,
              contenu: "Which is a valid Java variable declaration?",
              reponses: [
                { id: 4, contenu: "var x = 10", correcte: true },
                { id: 5, contenu: "x = 10", correcte: false },
                { id: 6, contenu: "int x", correcte: true }
              ]
            }
          ]
        },
        {
          id: 2,
          titre: "Database Concepts",
          dateCreation: "2025-05-02T14:30:00",
          classeId: 2,
          questions: [
            {
              id: 3,
              contenu: "What is SQL?",
              reponses: [
                { id: 7, contenu: "Structured Query Language", correcte: true },
                { id: 8, contenu: "Simple Question Language", correcte: false }
              ]
            }
          ]
        }
      ]);
    }
  };

  // Fetch classes from the API
  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:8081/api/prof/annonces/professeur/classes", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      // Use dummy data for development if needed
      setClasses([
        { id: 1, name: "Computer Science 101" },
        { id: 2, name: "Database Systems" },
        { id: 3, name: "Web Development" }
      ]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle question input changes
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Handle response input changes
  const handleResponseChange = (questionIndex, responseIndex, field, value) => {
    console.log(`Updating question ${questionIndex}, response ${responseIndex}, field ${field} to ${value}`);
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].reponses[responseIndex][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Add a new question to the form
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          contenu: "",
          reponses: [
            { contenu: "", correcte: false },
            { contenu: "", correcte: false }
          ]
        }
      ]
    });
  };

  // Remove a question from the form
  const removeQuestion = (index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Add a response to a question
  const addResponse = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].reponses.push({ contenu: "", correcte: false });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Remove a response from a question
  const removeResponse = (questionIndex, responseIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].reponses.splice(responseIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      
      // Validate form data
      if (!formData.titre || !formData.dateCreation || !formData.questions.length) {
        throw new Error("Please fill in all required fields");
      }

      for (const question of formData.questions) {
        if (!question.contenu || question.reponses.length < 2) {
          throw new Error("Each question must have content and at least 2 responses");
        }
        
        for (const response of question.reponses) {
          if (!response.contenu) {
            throw new Error("All response fields must be filled");
          }
        }
        
        // Ensure at least one response is marked as correct
        if (!question.reponses.some(r => r.correcte)) {
          throw new Error("Each question must have at least one correct answer");
        }
      }
      console.log(formData.questions)
      
      if (editMode) {
        // Update existing QCM
        const response = await fetch(`http://localhost:8081/api/prof/evaluation/info?classeId=${formData.classeId}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: editId,
            titre: formData.titre,
            dateCreation: new Date(formData.dateCreation).toISOString(),
            questions: formData.questions
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to update QCM");
        }
      } else {
        // Create new QCM
        const response = await fetch(`http://localhost:8081/api/prof/evaluation/create?classeId=${formData.classeId}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            titre: formData.titre,
            dateCreation: new Date(formData.dateCreation).toISOString(),
            questions: formData.questions
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to create QCM");
        }
      }
      
      // Reset form and refresh QCMs
      resetForm();
      fetchQcms();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.message || "Error saving QCM. Please try again.");
    }
  };

  // Reset the form to initial state
  const resetForm = () => {
    setFormData({
      titre: "",
      dateCreation: new Date().toISOString().split('T')[0],
      classeId: "",
      questions: [{ 
        contenu: "", 
        reponses: [
          { contenu: "", correcte: false },
          { contenu: "", correcte: false }
        ]
      }]
    });
    setShowForm(false);
    setEditMode(false);
    setEditId(null);
    setFormStep(1);
  };

  // Handle editing a QCM
  const handleEdit = (qcm) => {
    setEditMode(true);
    setEditId(qcm.id);
    
    // Format date for form input
    const formattedDate = new Date(qcm.dateCreation).toISOString().split('T')[0];
    
    setFormData({
      titre: qcm.titre,
      dateCreation: formattedDate,
      classeId: qcm.classeId,
      questions: qcm.questions
    });
    
    setShowForm(true);
    setFormStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Confirm deletion of a QCM
  const confirmDelete = (qcm) => {
    setQcmToDelete(qcm);
    setShowDeleteModal(true);
  };

  // Handle deletion of a QCM
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:8081/api/prof/evaluation/delete/${qcmToDelete.id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete QCM");
      }
      
      setShowDeleteModal(false);
      setQcmToDelete(null);
      fetchQcms();
    } catch (error) {
      console.error("Error deleting QCM:", error);
      alert("Error deleting QCM. Please try again.");
    }
  };

// Filter QCMs based on search query and selected class
const filteredQcms = qcms.filter(qcm => {
    const matchesSearch = 
        qcm.titre?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClass = 
        selectedClass === "all" || 
        (qcm.idClasse && qcm.idClasse.toString() === selectedClass);
    
    return matchesSearch && matchesClass;
});

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get class name by ID
  const getClassName = (id) => {
    const foundClass = classes.find(c => c.id === parseInt(id) || c.id === id);
    return foundClass ? foundClass.name : "Unknown Class";
  };

  // Toggle expanded QCM view
  const toggleExpandQcm = (id) => {
    if (expandedQcm === id) {
      setExpandedQcm(null);
    } else {
      setExpandedQcm(id);
    }
  };

  // Get gradient color based on ID
  const getGradient = (id) => {
    const gradients = [
      "from-emerald-500 to-teal-700",
      "from-violet-500 to-purple-800",
      "from-amber-500 to-orange-700",
      "from-sky-500 to-indigo-700",
      "from-rose-500 to-red-800",
      "from-lime-500 to-green-700",
      "from-fuchsia-500 to-pink-700",
      "from-cyan-500 to-blue-700",
    ];
    
    const index = typeof id === 'number' ? id % gradients.length : 0;
    return gradients[index];
  };
  
  // Navigate through form steps
  const nextFormStep = () => {
    setFormStep(formStep + 1);
  };

  const prevFormStep = () => {
    setFormStep(formStep - 1);
  };

  // Calculate class distribution
  const classDistribution = () => {
    const distribution = {};
    
    classes.forEach(cls => {
      distribution[cls.id] = 0;
    });
    
    qcms.forEach(qcm => {
      if (qcm.classeId && distribution[qcm.classeId] !== undefined) {
        distribution[qcm.classeId]++;
      }
    });
    
    return distribution;
  };
  
  // Get total number of questions
  const getTotalQuestions = () => {
    return qcms.reduce((total, qcm) => total + (qcm.questions?.length || 0), 0);
  };

  // Background patterns
  const patterns = [
    "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 80%)",
    "linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.05) 75%, transparent 75%, transparent)",
    "repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0, rgba(255, 255, 255, 0.02) 2px, transparent 2px, transparent 4px)",
    "radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 0%, transparent 10%), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.03) 0%, transparent 10%)",
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen pb-12">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: patterns[0], backgroundSize: '30px 30px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="md:flex items-center justify-between">
            <div className="md:w-3/5">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
                  <ClipboardDocumentCheckIcon className="w-10 h-10 mr-3" />
                  QCM Studio
                </h1>
                <p className="mt-1 text-lg max-w-2xl text-teal-100 font-medium">
                  Create interactive quizzes and evaluations to engage your students and measure their understanding
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  
                  
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  
                  
                  <div className="bg-transparent bg-opacity-20 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-2">
          
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  
                  
                  <div className="bg-transparent bg-opacity-20 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-2">
          
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  
                  
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  
                  
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-6 md:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className={`px-6 py-3 rounded-full flex items-center text-base font-medium shadow-lg transform transition hover:scale-105 ${
                  showForm
                    ? "bg-white text-teal-700 hover:bg-gray-100"
                    : "bg-white text-teal-700 hover:bg-gray-100"
                }`}
              >
                {showForm ? (
                  <>
                    <XMarkIcon className="w-5 h-5 mr-2" /> Cancel
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5 mr-2" /> Create Quiz
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#f9fafb" fillOpacity="1" d="M0,32L60,58.7C120,85,240,139,360,138.7C480,139,600,85,720,80C840,75,960,117,1080,133.3C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-6">
        {/* Dashboard Cards */}
        {!showForm && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6"
      >
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-emerald-100 p-2 sm:p-3 rounded-lg">
              <DocumentTextIcon className="h-5 sm:h-6 w-5 sm:w-6 text-emerald-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Total Quizzes</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">{qcms.length}</p>
                <p className="ml-2 text-xs sm:text-sm text-gray-500">created</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-violet-100 p-2 sm:p-3 rounded-lg">
              <QuestionMarkCircleIcon className="h-5 sm:h-6 w-5 sm:w-6 text-violet-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Total Questions</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-xl sm:text-2xl font-bold text-violet-600">{getTotalQuestions()}</p>
                <p className="ml-2 text-xs sm:text-sm text-gray-500">across all quizzes</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-amber-100 p-2 sm:p-3 rounded-lg">
              <UserGroupIcon className="h-5 sm:h-6 w-5 sm:w-6 text-amber-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Active Classes</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-xl sm:text-2xl font-bold text-amber-600">{classes.length}</p>
                <p className="ml-2 text-xs sm:text-sm text-gray-500">with quizzes</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-sky-100 p-2 sm:p-3 rounded-lg">
              <CalendarIcon className="h-5 sm:h-6 w-5 sm:w-6 text-sky-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Latest Quiz</h3>
              <div className="mt-1">
                <p className="text-base sm:text-lg font-bold text-sky-600 truncate max-w-xs">
                  {qcms.length > 0 ? 
                    qcms.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))[0]?.titre || "No quizzes" 
                    : "No quizzes"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )}
  

        {/* QCM Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white shadow-xl rounded-2xl mt-6 overflow-hidden border border-emerald-100"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                <div className="flex items-center">
                  <ClipboardDocumentCheckIcon className="w-6 h-6 text-white mr-3" />
                  <h2 className="text-xl font-bold text-white">
                    {editMode ? "Edit Quiz" : "Create New Quiz"}
                  </h2>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep >= 1 ? 'bg-white text-teal-600' : 'bg-teal-200 text-teal-400'} font-bold text-sm`}>
                        1
                      </div>
                      <div className={`h-1 w-12 ${formStep >= 2 ? 'bg-white' : 'bg-teal-200'} mx-2`}></div>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep >= 2 ? 'bg-white text-teal-600' : 'bg-teal-200 text-teal-400'} font-bold text-sm`}>
                        2
                      </div>
                      <div className={`h-1 w-12 ${formStep >= 3 ? 'bg-cat-teal-200' : ''} mx-2`}></div>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep >= 3 ? 'bg-white text-teal-600' : 'bg-teal-200 text-teal-400'} font-bold text-sm`}>
                        3
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Step 1: Basic Information */}
                {formStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
                          Quiz Title
                        </label>
                        <input
                          type="text"
                          id="titre"
                          name="titre"
                          value={formData.titre}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter a descriptive title for your quiz"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dateCreation" className="block text-sm font-medium text-gray-700 mb-1">
                          Creation Date
                        </label>
                        <input
                          type="date"
                          id="dateCreation"
                          name="dateCreation"
                          value={formData.dateCreation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="classeId" className="block text-sm font-medium text-gray-700 mb-1">
                          Select Class
                        </label>
                        <select
                          id="classeId"
                          name="classeId"
                          value={formData.classeId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        >
                          <option value="">-- Select a class --</option>
                          {classes.map(classe => (
                            <option key={classe.id} value={classe.id}>
                              {classe.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={nextFormStep}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Questions */}
                {formStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions</h3>
                    
                    <div className="space-y-6">
                      {formData.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-medium text-gray-800">Question {questionIndex + 1}</h4>
                            {formData.questions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeQuestion(questionIndex)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Question Content
                            </label>
                            <input
                              type="text"
                              value={question.contenu}
                              onChange={(e) => handleQuestionChange(questionIndex, "contenu", e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="Enter the question"
                              required
                            />
                          </div>
                          
                          <div className="space-y-4">
                            {question.reponses.map((reponse, responseIndex) => (
                              <div key={responseIndex} className="flex items-center space-x-4">
                                <input
  type="checkbox"
  checked={reponse.correcte}
  onChange={(e) => handleResponseChange(questionIndex, responseIndex, "correcte", e.target.checked)}
  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
/>
                                <input
                                  type="text"
                                  value={reponse.contenu}
                                  onChange={(e) => handleResponseChange(questionIndex, responseIndex, "contenu", e.target.value)}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-em	next pageerald-500 focus:border-emerald-500"
                                  placeholder={`Answer ${responseIndex + 1}`}
                                  required
                                />
                                {question.reponses.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeResponse(questionIndex, responseIndex)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            ))}
                            
                            <button
                              type="button"
                              onClick={() => addResponse(questionIndex)}
                              className="mt-2 px-4 py-2 text-sm text-emerald-600 hover:text-emerald-800 flex items-center"
                            >
                              <PlusIcon className="w-4 h-4 mr-1" /> Add Answer
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 flex items-center"
                      >
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Question
                      </button>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={prevFormStep}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={nextFormStep}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review and Submit */}
                {formStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Review and Submit</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Quiz Details</h4>
                      <p><strong>Title:</strong> {formData.titre}</p>
                      <p><strong>Date:</strong> {formatDate(formData.dateCreation)}</p>
                      <p><strong>Class:</strong> {getClassName(formData.classeId)}</p>
                      <p><strong>Total Questions:</strong> {formData.questions.length}</p>
                    </div>
                    
                    <div className="mt-4 space-y-4">
                      {formData.questions.map((question, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-md font-medium text-gray-800 mb-2">Question {index + 1}: {question.contenu}</h4>
                          <ul className="space-y-2">
                            {question.reponses.map((reponse, rIndex) => (
                              <li key={rIndex} className="flex items-center">
                                <span className={`mr-2 ${reponse.correcte ? 'text-emerald-600' : 'text-gray-600'}`}>
                                  {reponse.correcte ? <CheckCircleIcon className="w-4 h-4" /> : '○'}
                                </span>
                                {reponse.contenu}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={prevFormStep}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-colors"
                      >
                        {editMode ? "Update Quiz" : "Create Quiz"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters and Search */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <div className="relative w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Classes</option>
                {classes.map(classe => (
                  <option key={classe.id} value={classe.id}>{classe.name}</option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentView("grid")}
                  className={`p-2 rounded-lg ${currentView === "grid" ? "bg-emerald-100 text-emerald-700" : "text-gray-600"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentView("list")}
                  className={`p-2 rounded-lg ${currentView === "list" ? "bg-emerald-100 text-emerald-700" : "text-gray-600"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* QCM List */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 ${currentView === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}
          >
            {loading ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <ArrowPathIcon className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
            ) : filteredQcms.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <LightBulbIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No quizzes found. Create a new quiz to get started!</p>
              </div>
            ) : (
              filteredQcms.map((qcm, index) => (
                <motion.div
                  key={qcm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: animateCards ? index * 0.1 : 0 }}
                  className={`bg-white rounded-xl shadow-md overflow-hidden ${currentView === "grid" ? "border border-gray-100" : "flex items-center p-4"}`}
                >
                  <div className={`bg-gradient-to-r ${getGradient(qcm.id)} p-4 ${currentView === "grid" ? "h-32" : "w-1/4"} flex items-center justify-center`}>
                    <DocumentTextIcon className="w-12 h-12 text-white opacity-80" />
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{qcm.titre}</h3>
                        <p className="text-sm text-gray-600">{qcm.nomClasse}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(qcm)}
                          className="p-2 text-gray-600 hover:text-emerald-600"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(qcm)}
                          className="p-2 text-gray-600 hover:text-red-600"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleExpandQcm(qcm.id)}
                          className="p-2 text-gray-600 hover:text-emerald-600"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {formatDate(qcm.dateCreation)}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <QuestionMarkCircleIcon className="w-4 h-4 mr-1" />
                      {qcm.questions?.length || 0} questions
                    </div>
                    
                    <AnimatePresence>
                      {expandedQcm === qcm.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 border-t border-gray-200 pt-4"
                        >
                          {qcm.questions.map((question, qIndex) => (
                            <div key={qIndex} className="mb-4">
                              <p className="font-medium text-gray-800">{qIndex + 1}. {question.contenu}</p>
                              <ul className="mt-2 space-y-1">
                                {question.reponses.map((reponse, rIndex) => (
                                  <li key={rIndex} className={`text-sm ${reponse.correcte ? "text-green-600" : "text-gray-600"}`}>
                                    {reponse.contenu} {reponse.correcte && <CheckCircleIcon className="w-4 h-4 inline ml-1" />}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              >
                <div className="flex items-center mb-4">
                  <ExclamationCircleIcon className="w-6 h-6 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the quiz "{qcmToDelete?.titre}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QcmPage;