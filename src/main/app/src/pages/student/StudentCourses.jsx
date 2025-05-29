import React, { useState, useEffect, useRef, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, CheckCircle, Eye, Megaphone, Filter, Search, Loader2, Bell, User, Tag, X, Archive, ChevronDown, ChevronUp, Clock, FileText } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const AnnouncementDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [filterSeen, setFilterSeen] = useState('unseen');
  const [filters, setFilters] = useState({ classes: [], professors: [] });
  const [availableFilters, setAvailableFilters] = useState({ classes: [], professors: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [themeColor, setThemeColor] = useState('indigo');
  const [showArchive, setShowArchive] = useState(false);
  const detailPanelRef = useRef(null);

  // Enhanced theme system
  const themeColors = {
    indigo: {
      primary: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      secondary: 'bg-blue-100/50 backdrop-blur-sm',
      hover: 'hover:from-indigo-700 hover:to-purple-700',
      text: 'text-indigo-600',
      border: 'border-indigo-500/30',
      light: 'bg-indigo-50/30 backdrop-blur-sm',
      gradient: 'from-indigo-500 to-purple-600',
      accent: 'bg-indigo-200/50'
    },
    emerald: {
      primary: 'bg-gradient-to-r from-emerald-600 to-teal-600',
      secondary: 'bg-emerald-100/50 backdrop-blur-sm',
      hover: 'hover:from-emerald-700 hover:to-teal-700',
      text: 'text-emerald-600',
      border: 'border-emerald-500/30',
      light: 'bg-emerald-50/30 backdrop-blur-sm',
      gradient: 'from-emerald-500 to-teal-600',
      accent: 'bg-emerald-200/50'
    },
    rose: {
      primary: 'bg-gradient-to-r from-rose-600 to-pink-600',
      secondary: 'bg-rose-100/50 backdrop-blur-sm',
      hover: 'hover:from-rose-700 hover:to-pink-700',
      text: 'text-rose-600',
      border: 'border-rose-500/30',
      light: 'bg-rose-50/30 backdrop-blur-sm',
      gradient: 'from-rose-500 to-pink-600',
      accent: 'bg-rose-200/50'
    }
  };

  const theme = themeColors[themeColor];

  // Handle click outside detail panel
  useEffect(() => {
    function handleClickOutside(event) {
      if (detailPanelRef.current && !detailPanelRef.current.contains(event.target)) {
        setShowDetailPanel(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:8081/api/etudiant/annonces', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch announcements');
      }

      const data = await response.json();
      const announcementsWithSeenStatus = await Promise.all(
        data.map(async (announce) => {
          const seenResponse = await fetch(`http://localhost:8081/api/etudiant/annonces/${announce.id}/vu`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!seenResponse.ok) {
            const errorData = await seenResponse.json();
            throw new Error(errorData.message || 'Failed to check seen status');
          }

          const isSeen = await seenResponse.json();
          return { ...announce, seen: isSeen };
        })
      );

      const classes = [...new Set(announcementsWithSeenStatus.flatMap(a => a.classeNom || []))];
      const professors = [...new Set(announcementsWithSeenStatus.map(a => a.professeurEmail))];
      
      setAvailableFilters({ classes, professors });
      setAnnouncements(announcementsWithSeenStatus);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast.error(err.message);
    }
  };

  const markAsSeen = async (annonceId, e) => {
    e?.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`http://localhost:8081/api/etudiant/annonces/${annonceId}/vu`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark announcement as seen');
      }

      setAnnouncements(announcements.map(announce =>
        announce.id === annonceId ? { ...announce, seen: true } : announce
      ));
      toast.success('Announcement marked as seen');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const markAllAsSeen = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const previousAnnouncements = announcements;
      setAnnouncements(prev =>
        prev.map(announce => (announce.seen ? announce : { ...announce, seen: true }))
      );

      const response = await fetch(`http://localhost:8081/api/etudiant/annonces/mark-all-seen`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark all announcements as seen');
      }

      toast.success('All announcements marked as seen');
    } catch (err) {
      setAnnouncements(previousAnnouncements);
      toast.error(err.message);
    }
  };

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      if (prev[type].includes(value)) {
        return { ...prev, [type]: prev[type].filter(item => item !== value) };
      }
      return { ...prev, [type]: [...prev[type], value] };
    });
  };

  const clearFilters = () => {
    setFilters({ classes: [], professors: [] });
    setFilterSeen('unseen');
    setSearchTerm('');
  };

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailPanel(true);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announce => {
      const matchesSearch =
        searchTerm === '' ||
        announce.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announce.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announce.professeurEmail?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass =
        filters.classes.length === 0 ||
        (announce.classeNom && announce.classeNom.some(c => filters.classes.includes(c)));

      const matchesProfessor =
        filters.professors.length === 0 ||
        filters.professors.includes(announce.professeurEmail);

      const matchesSeen =
        filterSeen === 'all' ||
        (filterSeen === 'seen' && announce.seen) ||
        (filterSeen === 'unseen' && !announce.seen);

      return matchesSearch && matchesClass && matchesProfessor && matchesSeen;
    });
  }, [announcements, searchTerm, filters, filterSeen]);

  const sortedAnnouncements = useMemo(() => {
    return [...filteredAnnouncements].sort((a, b) => {
      const dateA = new Date(a.datePublication);
      const dateB = new Date(b.datePublication);

      switch (sortBy) {
        case 'dateDesc': return dateB - dateA;
        case 'dateAsc': return dateA - dateB;
        case 'titleAsc': return a.titre.localeCompare(b.titre);
        case 'titleDesc': return b.titre.localeCompare(a.titre);
        default: return dateB - dateA;
      }
    });
  }, [filteredAnnouncements, sortBy]);

  const unseenAnnouncements = sortedAnnouncements.filter(a => !a.seen);
  const seenAnnouncements = sortedAnnouncements.filter(a => a.seen);

  return (
    <div className="min-h-screen bg-transparent from-gray-50 to-gray-100 p-6 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Floating Theme Switcher */}
      <div className="fixed top-4 right-4 z-50 flex space-x-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
        {Object.keys(themeColors).map(color => (
          <button
            key={color}
            onClick={() => setThemeColor(color)}
            className={`w-8 h-8 rounded-full ${themeColors[color].primary} transition-transform duration-300 ${color === themeColor ? 'scale-125 ring-2 ring-white' : 'scale-100'}`}
            aria-label={`Switch to ${color} theme`}
          />
        ))}
      </div>

      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-64 h-64 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full -top-32 -left-32 blur-3xl animate-pulse" />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full -bottom-32 -right-32 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center animate-fade-in">
            <Megaphone className="mr-3 h-10 w-10" />
            Student Announcements
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchAnnouncements()}
              className={`${theme.secondary} text-blue-800 p-2 rounded-full hover:bg-blue-300 transition-all duration-300 transform hover:rotate-90`}
              aria-label="Refresh"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`${showFilters ? theme.primary : theme.secondary} text-blue-800 p-2 rounded-full ${theme.hover} hover:bg-blue-300 transition-all duration-300`}
              aria-label="Show filters"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className={`${theme.secondary} rounded-2xl shadow-2xl p-6 mb-8 transition-all duration-500 ${showFilters ? 'scale-100' : 'scale-95'}`}>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search announcements..."
                className="pl-10 pr-4 py-3 w-full border-none rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`${theme.accent} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
              >
                <option value="dateDesc">Newest first</option>
                <option value="dateAsc">Oldest first</option>
                <option value="titleAsc">Title A-Z</option>
                <option value="titleDesc">Title Z-A</option>
              </select>
              <select
                value={filterSeen}
                onChange={(e) => setFilterSeen(e.target.value)}
                className={`${theme.accent} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
              >
                <option value="unseen">Unread</option>
                <option value="seen">Read</option>
                <option value="all">All</option>
              </select>
            </div>
            {unseenAnnouncements.length > 0 && (
              <button
                onClick={markAllAsSeen}
                className={`${theme.primary} text-white px-4 py-2 rounded-lg ${theme.hover} flex items-center transform hover:scale-105 transition-all duration-300`}
              >
                <Eye className="mr-2 h-4 w-4" />
                Mark All as Read
              </button>
            )}
          </div>

          {/* Animated Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200/30 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Filter by Class
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {availableFilters.classes.map(cls => (
                      <button
                        key={cls}
                        onClick={() => toggleFilter('classes', cls)}
                        className={`px-4 py-2 text-sm rounded-full transition-all duration-300 transform hover:scale-105 ${
                          filters.classes.includes(cls)
                            ? `${theme.primary} text-white`
                            : `${theme.accent} text-gray-800 hover:bg-gray-200`
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Filter by Professor
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {availableFilters.professors.map(prof => (
                      <button
                        key={prof}
                        onClick={() => toggleFilter('professors', prof)}
                        className={`px-4 py-2 text-sm rounded-full transition-all duration-300 transform hover:scale-105 ${
                          filters.professors.includes(prof)
                            ? `${theme.primary} text-white`
                            : `${theme.accent} text-gray-800 hover:bg-gray-200`
                        }`}
                      >
                        {prof}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {(filters.classes.length > 0 || filters.professors.length > 0 || filterSeen !== 'unseen' || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="mt-6 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center h-64 bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-500 mb-4" />
            <p className="text-gray-600 font-medium">Loading announcements...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-lg mb-6">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Unseen Announcements */}
        {!loading && !error && unseenAnnouncements.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Bell className="h-6 w-6 mr-2 text-indigo-600" />
              New Announcements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unseenAnnouncements.map(announce => (
                <Tilt key={announce.id} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                  <div
                    onClick={() => handleAnnouncementClick(announce)}
                    className={`${theme.secondary} rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 border-l-8 ${theme.border} hover:shadow-2xl`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{announce.titre}</h2>
                        <span className={`${theme.primary} text-white px-3 py-1 rounded-full text-xs flex items-center`}>
                          <Bell className="mr-1 h-3 w-3" />
                          New
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{announce.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {announce.classeNom?.map((cls, index) => (
                          <span key={index} className={`${theme.accent} text-gray-700 px-2 py-1 rounded text-xs`}>
                            {cls}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          <span className="truncate max-w-[180px]">Pr. {announce.professeurEmail}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{getTimeAgo(announce.datePublication)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100/30">
                      <button
                        onClick={(e) => markAsSeen(announce.id, e)}
                        className={`${theme.primary} text-white px-4 py-2 rounded-lg ${theme.hover} w-full flex items-center justify-center transition-all duration-300 transform hover:scale-105`}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Mark as Read
                      </button>
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        )}

        {/* Seen Announcements (Archive) */}
        {!loading && !error && seenAnnouncements.length > 0 && (
          <div className="mb-12">
            <button
              onClick={() => setShowArchive(!showArchive)}
              className={`${theme.primary} text-white px-6 py-3 rounded-lg ${theme.hover} flex items-center mb-6 transition-all duration-300 transform hover:scale-105`}
            >
              <Archive className="mr-2 h-5 w-5" />
              {showArchive ? 'Hide Archive' : 'Show Archive'} ({seenAnnouncements.length})
              {showArchive ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
            </button>
            {showArchive && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-down">
                {seenAnnouncements.map(announce => (
                  <Tilt key={announce.id} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                    <div
                      onClick={() => handleAnnouncementClick(announce)}
                      className={`${theme.light} rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{announce.titre}</h2>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs flex items-center">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Read
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{announce.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {announce.classeNom?.map((cls, index) => (
                            <span key={index} className={`${theme.accent} text-gray-700 px-2 py-1 rounded text-xs`}>
                              {cls}
                          </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="mr-1 h-4 w-4" />
                            <span className="truncate max-w-[180px]">{announce.professeurEmail}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>{getTimeAgo(announce.datePublication)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tilt>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Announcements */}
        {!loading && !error && sortedAnnouncements.length === 0 && (
          <div className={`${theme.secondary} rounded-2xl shadow-2xl p-8 text-center`}>
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No announcements available</h3>
            <p className="text-gray-500">
              {searchTerm || filters.classes.length > 0 || filters.professors.length > 0 || filterSeen !== 'unseen'
                ? "No announcements match your current filters"
                : "There are no announcements to display at this time"}
            </p>
            {(searchTerm || filters.classes.length > 0 || filters.professors.length > 0 || filterSeen !== 'unseen') && (
              <button
                onClick={clearFilters}
                className={`mt-4 ${theme.text} hover:underline font-medium transition-colors duration-300`}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            className={`${theme.primary} text-white p-4 rounded-full shadow-2xl ${theme.hover} transition-all duration-300 transform hover:scale-110 hover:rotate-90`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-6 w-6" />
          </button>
        </div>

        {showDetailPanel && selectedAnnouncement && (
          <div
            ref={detailPanelRef}
            className={`${theme.secondary} bg-white fixed right-0 top-16 h-full w-96 p-6 shadow-2xl animate-slide-in-right overflow-y-auto z-50`}
          >
            <button
              onClick={() => setShowDetailPanel(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedAnnouncement.titre}</h2>
            <p className="text-gray-600 mb-6 break-words">{selectedAnnouncement.description}</p>
            <p className="text-gray-600 mb-6 break-words">{selectedAnnouncement.contenu}</p>
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-500">
                <User className="mr-2 h-4 w-4" />
                <span>{selectedAnnouncement.professeurEmail}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDate(selectedAnnouncement.datePublication)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAnnouncement.classeNom?.map((cls, index) => (
                  <span key={index} className={`${theme.accent} text-gray-700 px-2 py-1 rounded text-xs`}>
                    {cls}
                  </span>
                ))}
              </div>
              {!selectedAnnouncement.seen && (
                <button
                  onClick={() => markAsSeen(selectedAnnouncement.id)}
                  className={`${theme.primary} text-white px-4 py-2 rounded-lg ${theme.hover} w-full flex items-center justify-center transition-all duration-300`}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        )}
        {!loading && !error && announcements.length > 0 && (
          <div className={`${theme.secondary} rounded-2xl shadow-2xl p-6 mt-8`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Bell, label: 'Total', value: announcements.length },
                { icon: Eye, label: 'Read', value: announcements.filter(a => a.seen).length },
                { icon: FileText, label: 'Unread', value: announcements.filter(a => !a.seen).length },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center">
                  <div className={`${theme.light} rounded-full p-3 ${theme.text} mr-4 transition-transform duration-300 hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.5s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AnnouncementDashboard;