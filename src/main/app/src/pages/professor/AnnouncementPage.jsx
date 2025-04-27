import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  BellIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ArrowPathIcon,
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

  // Fetch announcements and classes on component mount
  useEffect(() => {
    fetchAnnouncements();
    fetchClasses();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:8081/api/prof/annonces/professeur/email", {
        headers : {
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
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:8081/api/prof/annonces/professeur/classes", {
        headers : {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      
      if (editMode) {
        // Update existing announcement
        const response = await fetch(`http://localhost:8081/api/prof/annonces/${editId}`, {
          method: "PUT",
          headers : {
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
        // Create new announcement
        const response = await fetch(`http://localhost:8081/api/prof/annonces?classeId=${formData.classeId}`, {
          method: "POST",
          headers : {
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
      
      // Reset form and reload announcements
      setFormData({
        titre: "",
        description: "",
        contenu: "",
        classeId: "",
      });
      setShowForm(false);
      setEditMode(false);
      setEditId(null);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error saving announcement. Please try again.");
    }
  };

  const handleEdit = (announcement) => {
    setEditMode(true);
    setEditId(announcement.id);
    setFormData({
      titre: announcement.titre,
      description: announcement.description,
      contenu: announcement.contenu,
      classeId: announcement.classe?.id || "",
    });
    setShowForm(true);
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
        headers : {
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

  // Filter announcements based on search query and selected class
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = 
      announcement.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClass = 
      selectedClass === "all" || 
      (announcement.classe && announcement.classe.id.toString() === selectedClass);
    
    return matchesSearch && matchesClass;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BellIcon className="w-7 h-7 text-indigo-500 mr-2" />
                Announcement Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create and manage announcements for your classes
              </p>
            </div>
            <button
              onClick={() => {
                setEditMode(false);
                setFormData({
                  titre: "",
                  description: "",
                  contenu: "",
                  classeId: "",
                });
                setShowForm(!showForm);
              }}
              className={`px-4 py-2 rounded-md flex items-center text-sm font-medium shadow-sm ${
                showForm
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {showForm ? (
                <>
                  <XMarkIcon className="w-5 h-5 mr-1" /> Cancel
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5 mr-1" /> New Announcement
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-md rounded-lg mt-6 p-6"
          >
            <div className="flex items-center mb-4">
              <DocumentTextIcon className="w-5 h-5 text-indigo-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">
                {editMode ? "Edit Announcement" : "Create New Announcement"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter announcement title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brief Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter a brief description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    name="contenu"
                    value={formData.contenu}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter the detailed content of your announcement"
                  />
                </div>

                {!editMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class
                    </label>
                    <select
                      name="classeId"
                      value={formData.classeId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select a class</option>
                      {classes.map((classe) => (
                        <option key={classe.id} value={classe.id}>
                          {classe.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {editMode ? "Update Announcement" : "Create Announcement"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Filters & Search */}
        <div className="bg-white shadow-sm rounded-lg mt-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
            <div className="relative max-w-xs">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search announcements..."
              />
            </div>

            <div className="flex space-x-3">
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                title="Refresh"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="mt-6">
          {loading ? (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
              <p className="mt-4 text-gray-500">Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <BellIcon className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || selectedClass !== "all"
                  ? "No announcements match your current filters."
                  : "Get started by creating a new announcement."}
              </p>
              {searchQuery === "" && selectedClass === "all" && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    New Announcement
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {announcement.titre}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                            {announcement.classe?.name || "All Classes"}
                          </span>
                          <span className="text-gray-500 text-sm ml-3">
                            {formatDate(announcement.datePublication)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(announcement)}
                          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700">{announcement.description}</p>
                    <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
                      {announcement.contenu}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Delete Announcement?
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete the announcement "{announcementToDelete?.titre}"? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementPage;