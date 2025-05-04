import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  BellIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  ClockIcon,
  EyeIcon,
  UserGroupIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    contenu: "",
    classeId: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
  const [currentView, setCurrentView] = useState("grid");
  const [formStep, setFormStep] = useState(1);
  const [animateCards, setAnimateCards] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission

  // Fetch announcements and classes on component mount
  useEffect(() => {
    fetchAnnouncements();
    fetchClasses();
    
    setTimeout(() => {
      setAnimateCards(true);
    }, 500);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:8081/api/prof/annonces/professeur/email", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      
      const data = await response.json();
      setAnnouncements(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setLoading(false);
    }
  };

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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Debounced submit handler to prevent double submissions
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    if (isSubmitting) {
      console.log("Submission already in progress, ignoring...");
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting announcement:", formData);

    try {
      const token = localStorage.getItem("token");
      
      if (editMode) {
        console.log("Updating announcement ID:", editId);
        const response = await fetch(`http://localhost:8081/api/prof/annonces/${editId}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            titre: formData.titre,
            description: formData.description,
            contenu: formData.contenu,
            datePublication: new Date().toISOString()
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to update announcement");
        }
      } else {
        console.log("Creating new announcement for class ID:", formData.classeId);
        const response = await fetch(`http://localhost:8081/api/prof/annonces?classeId=${formData.classeId}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            titre: formData.titre,
            description: formData.description,
            contenu: formData.contenu,
            datePublication: new Date().toISOString()
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to create announcement");
        }
      }
      
      setFormData({
        titre: "",
        description: "",
        contenu: "",
        classeId: "",
      });
      setShowForm(false);
      setEditMode(false);
      setEditId(null);
      setFormStep(1);
      await fetchAnnouncements();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error saving announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editMode, editId, isSubmitting]);

  const handleEdit = (announcement) => {
    setEditMode(true);
    setEditId(announcement.id);
    setFormData({
      titre: announcement.titre,
      description: announcement.description,
      contenu: announcement.contenu,
      classeId: announcement.classeId || "",
    });
    setShowForm(true);
    setFormStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:8081/api/prof/annonces/${announcementToDelete.id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }
      
      setShowDeleteModal(false);
      setAnnouncementToDelete(null);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Error deleting announcement. Please try again.");
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = 
      announcement.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClass = 
      selectedClass === "all" || 
      (announcement.classeId && announcement.classeId.toString() === selectedClass);
    
    return matchesSearch && matchesClass;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getClassName = (id) => {
    const foundClass = classes.find(c => c.id === parseInt(id) || c.id === id);
    return foundClass ? foundClass.name : "Unknown Class";
  };

  const toggleExpandAnnouncement = (id) => {
    if (expandedAnnouncement === id) {
      setExpandedAnnouncement(null);
    } else {
      setExpandedAnnouncement(id);
    }
  };

  const getGradient = (id) => {
    const gradients = [
      "from-purple-400 to-indigo-500",
      "from-blue-400 to-cyan-500",
      "from-emerald-400 to-teal-500",
      "from-amber-400 to-orange-500",
      "from-pink-400 to-rose-500",
      "from-indigo-400 to-purple-500",
      "from-sky-400 to-blue-500",
      "from-lime-400 to-green-500",
    ];
    
    const index = typeof id === 'number' ? id % gradients.length : 0;
    return gradients[index];
  };

  const nextFormStep = () => {
    setFormStep(formStep + 1);
  };

  const prevFormStep = () => {
    setFormStep(formStep - 1);
  };

  const classDistribution = () => {
    const distribution = {};
    
    classes.forEach(cls => {
      distribution[cls.id] = 0;
    });
    
    announcements.forEach(announcement => {
      if (announcement.classeId && distribution[announcement.classeId] !== undefined) {
        distribution[announcement.classeId]++;
      }
    });
    
    return distribution;
  };
  
  const distribution = classDistribution();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen pb-12">
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjQiPjxwYXRoIGQ9Ik0yOS41IDI2LjVMMzUgMzFsLTUuNSA0LjV2LTl6Ii8+PHBhdGggZD0iTTMwIDI3TDM1LjUgMzFsLTUuNSA0di04eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
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
                  <SpeakerWaveIcon className="w-10 h-10 mr-3" />
                  Announcement Central
                </h1>
                <p className="mt-3 text-lg max-w-2xl bg-gradient-to-r from-pink-400 via-pink-300 to-pink-300 bg-clip-text text-transparent font-medium">
                  Create, manage and distribute important announcements to your classes with style and efficiency
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  
                  
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  
                  
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  
                  
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  
                  
                </div>
                <div className="mt-2 flex flex-wrap gap-3">
                  
                  
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
                  setEditMode(false);
                  setFormData({
                    titre: "",
                    description: "",
                    contenu: "",
                    classeId: "",
                  });
                  setFormStep(1);
                  setShowForm(!showForm);
                }}
                className={`px-6 py-3 rounded-full flex items-center text-base font-medium shadow-lg transform transition hover:scale-105 ${
                  showForm
                    ? "bg-white text-purple-700 hover:bg-gray-100"
                    : "bg-white text-purple-700 hover:bg-gray-100"
                }`}
              >
                {showForm ? (
                  <>
                    <XMarkIcon className="w-5 h-5 mr-2" /> Cancel
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5 mr-2" /> Create Announcement
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#f9fafb" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-6">
        {!showForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          >
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Total Announcements</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-bold text-indigo-600">{announcements.length}</p>
                    <p className="ml-2 text-sm text-gray-500">across all classes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Active Classes</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-bold text-purple-600">{classes.length}</p>
                    <p className="ml-2 text-sm text-gray-500">receiving announcements</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-pink-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-bold text-pink-600">
                      {announcements.length > 0 ? 
                        formatDate(announcements.sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication))[0]?.datePublication || new Date()) 
                        : "No activity"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white shadow-xl rounded-2xl mt-6 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex items-center">
                  <DocumentTextIcon className="w-6 h-6 text-white mr-3" />
                  <h2 className="text-xl font-bold text-white">
                    {editMode ? "Edit Announcement" : "Create New Announcement"}
                  </h2>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep >= 1 ? 'bg-white text-purple-600' : 'bg-purple-200 text-purple-400'} font-bold text-sm`}>
                        1
                      </div>
                      <div className={`h-1 w-12 ${formStep >= 2 ? 'bg-white' : 'bg-purple-200'} mx-2`}></div>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep >= 2 ? 'bg-white text-purple-600' : 'bg-purple-200 text-purple-400'} font-bold text-sm`}>
                        2
                      </div>
                      <div className={`h-1 w-12 ${formStep >= 3 ? 'bg-white' : 'bg-purple-200'} mx-2`}></div>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep >= 3 ? 'bg-white text-purple-600' : 'bg-purple-200 text-purple-400'} font-bold text-sm`}>
                        3
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  {formStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3 className="font-medium text-gray-900 text-lg mb-4">Basic Information</h3>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Enter a clear, concise title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brief Description <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Enter a brief summary of your announcement"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            This will appear in the announcement list preview
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Class <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="classeId"
                              value={formData.classeId}
                              onChange={handleInputChange}
                              required
                              className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            >
                              <option value="">Select a class</option>
                              {classes.map((classe) => (
                                <option key={classe.id} value={classe.id}>
                                  {classe.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3 className="font-medium text-gray-900 text-lg mb-4">Content Details</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="contenu"
                          value={formData.contenu}
                          onChange={handleInputChange}
                          required
                          rows={8}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          placeholder="Enter the full content of your announcement..."
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          Add all details, instructions, and relevant information for your students
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {formStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3 className="font-medium text-gray-900 text-lg mb-4">Review & Submit</h3>
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Title</h4>
                            <p className="mt-1 text-lg font-medium">{formData.titre}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Description</h4>
                            <p className="mt-1">{formData.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Target Class</h4>
                            <p className="mt-1">{formData.classeId ? getClassName(formData.classeId) : "No class selected"}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Content</h4>
                            <div className="mt-1 bg-white p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                              <p className="whitespace-pre-wrap">{formData.contenu}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                  {formStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevFormStep}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  )}
                  
                  {formStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextFormStep}
                      className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition flex items-center"
                    >
                      Next Step
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition flex items-center ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          {editMode ? "Update Announcement" : "Publish Announcement"}
                          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white shadow-md rounded-xl mt-6 p-5 border border-gray-100"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative w-full md:max-w-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Search by title or description..."
                />
              </div>

              <div className="flex space-x-3 items-center">
                <div className="bg-gray-100 p-1 rounded-lg flex space-x-1 mr-2">
                  <button
                    onClick={() => setCurrentView("grid")}
                    className={`p-2 rounded-md ${
                      currentView === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentView("list")}
                    className={`p-2 rounded-md ${
                      currentView === "list" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    <option value="all">All Classes</option>
                    {classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>
                        {classe.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={fetchAnnouncements}
                  className="p-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                  title="Refresh"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-6 pb-10">
          {loading ? (
            <div className="bg-white shadow-lg rounded-xl p-10 text-center border border-gray-100">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
              </div>
              <p className="mt-6 text-gray-500 text-lg">Loading your announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="bg-white shadow-lg rounded-xl p-12 text-center border border-gray-100">
              <div className="mx-auto h-20 w-20 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center">
                <BellIcon className="h-10 w-10" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No announcements found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                {searchQuery || selectedClass !== "all"
                  ? "No announcements match your current filters. Try adjusting your search criteria."
                  : "Get started by creating your first announcement to keep your students informed."}
              </p>
              {searchQuery === "" && selectedClass === "all" && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowForm(true)}
                    class dedo="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Your First Announcement
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {currentView === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAnnouncements.map((announcement, index) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: animateCards ? 1 : 0, y: animateCards ? 0 : 20 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      <div className={`h-3 bg-gradient-to-r ${getGradient(announcement.id)}`}></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{announcement.titre}</h3>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEdit(announcement)}
                              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition"
                              title="Edit"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDelete(announcement)}
                              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500 transition"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            {announcement.classeNom || getClassName(announcement.classeId) || "No Class"}
                          </span>
                          <span className="text-gray-500 text-xs flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {formatDate(announcement.datePublication)}
                          </span>
                        </div>
                        
                        <p className="mt-3 text-gray-600 text-sm line-clamp-2">{announcement.description}</p>
                        
                        <div className="mt-4">
                          <button
                            onClick={() => toggleExpandAnnouncement(announcement.id)}
                            className="flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-800 transition"
                          >
                            <EyeIcon className="w-4 h-4 mr-1" />
                            {expandedAnnouncement === announcement.id ? "Hide Details" : "View Details"}
                          </button>
                        </div>
                        
                        <AnimatePresence>
                          {expandedAnnouncement === announcement.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 overflow-hidden"
                            >
                              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto border border-gray-100">
                                {announcement.contenu}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {currentView === "list" && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Class
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Published
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAnnouncements.map((announcement) => (
                          <motion.tr
                            key={announcement.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{announcement.titre}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">{announcement.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-indigo-50 text-indigo-700">
                                {announcement.classeNom || getClassName(announcement.classeId) || "No Class"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(announcement.datePublication)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => toggleExpandAnnouncement(announcement.id)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                {expandedAnnouncement === announcement.id ? "Hide" : "View"}
                              </button>
                              <button
                                onClick={() => handleEdit(announcement)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => confirmDelete(announcement)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Expanded row view */}
                  <AnimatePresence>
                    {expandedAnnouncement && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 overflow-hidden"
                      >
                        {filteredAnnouncements.map((announcement) => (
                          announcement.id === expandedAnnouncement && (
                            <div key={`expanded-${announcement.id}`} className="p-6 bg-gray-50">
                              <h4 className="text-base font-medium text-gray-900 mb-2">{announcement.titre}</h4>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{announcement.contenu}</p>
                            </div>
                          )
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Pagination placeholder - could be implemented with actual pagination logic */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredAnnouncements.length}</span> announcements
                </div>
                <div className="flex-1 flex justify-end">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 mx-4"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                  <TrashIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Confirm Deletion
                </h3>
                <p className="mt-3 text-gray-500">
                  Are you sure you want to delete the announcement <span className="font-medium text-gray-800">"{announcementToDelete?.titre}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:from-red-600 hover:to-red-700 transition"
                >
                  Delete Announcement
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center">
              <SpeakerWaveIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <span className="text-gray-900 font-medium">Announcement Central</span>
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-right">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} School Management System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>{`
        @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
      `}</style>
    </div>
  );
};

export default AnnouncementPage;