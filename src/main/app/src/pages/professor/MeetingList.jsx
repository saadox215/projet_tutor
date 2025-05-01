import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, X, Calendar, Users, Clock, Sparkles, ChevronUp, ChevronDown, Star, Music, Volume2, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

const MeetingList = ({ token }) => {
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [darkMode, setDarkMode] = useState(false);
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [currentSong, setCurrentSong] = useState({ title: 'Focus Flow', artist: 'Ambient Beats' });
  const [volume, setVolume] = useState(70);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Motion values for animations
  const headerRef = useRef(null);
  const mousePosX = useMotionValue(0);
  const mousePosY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const mouseX = useSpring(mousePosX, springConfig);
  const mouseY = useSpring(mousePosY, springConfig);

  // Mouse move parallax effect
  useEffect(() => {
    fetchMeetings();
    const handleMouseMove = (e) => {
      mousePosX.set(e.clientX);
      mousePosY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mousePosX, mousePosY]);

  const fetchMeetings = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8081/api/prof/live-streaming/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch meetings');
      }
      const data = await response.json();
      console.log('Fetched meetings:', data);
      setMeetings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleDeleteMeeting = async (id) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8081/api/prof/live-streaming/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete meeting');
      }
      setMeetings(meetings.filter((meeting) => meeting.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateMeeting = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const updatedMeeting = {
        sujet: editingMeeting.sujet,
        classNom: editingMeeting.classNom,
        dateCreation: editingMeeting.dateCreation,
        duration: editingMeeting.duration,
        expectedAttendees: editingMeeting.expectedAttendees,
      };
      const response = await fetch(`http://localhost:8081/api/prof/live-streaming/${editingMeeting.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMeeting),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update meeting');
      }
      setMeetings(
        meetings.map((meeting) =>
          meeting.id === editingMeeting.id ? { ...meeting, ...updatedMeeting } : meeting
        )
      );
      setShowEditModal(false);
      setEditingMeeting(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (meeting) => {
    setEditingMeeting({ ...meeting });
    setShowEditModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const timeUntilMeeting = (dateString) => {
    const meetingDate = new Date(dateString);
    const now = new Date();
    const diffMs = meetingDate - now;
    if (diffMs < 0) return 'Started';
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m`;
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.dateCreation);
    const now = new Date();
    if (activeTab === 'upcoming') return meetingDate > now;
    if (activeTab === 'past') return meetingDate < now;
    return true;
  });

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`relative min-h-screen p-6 overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-indigo-50'}`}>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top controls bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex justify-between items-center p-4 mb-6 rounded-2xl backdrop-blur-md ${darkMode ? 'bg-gray-800/70' : 'bg-white/70'} shadow-lg`}
        >
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-indigo-100 text-indigo-600'}`}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setShowMusicControls(!showMusicControls)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-purple-300' : 'bg-indigo-100 text-indigo-600'}`}
          >
            <Music className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Virtual Classroom Pro</span>
            <span className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">PREMIUM</span>
          </div>

          <button
            onClick={fetchMeetings}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg transition-all ${
              darkMode
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            } text-white`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </motion.div>

        {/* Music Controls Popover */}
        <AnimatePresence>
          {showMusicControls && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute right-28 top-20 z-50 p-4 rounded-xl shadow-xl ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              } w-64`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Ambient Music</h4>
                <button onClick={() => setShowMusicControls(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className={`p-3 mb-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currentSong.title}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{currentSong.artist}</p>
                  </div>
                  <button
                    onClick={toggleMusic}
                    className={`p-2 rounded-full ${
                      isPlaying
                        ? darkMode
                          ? 'bg-purple-600'
                          : 'bg-indigo-600'
                        : darkMode
                        ? 'bg-gray-600'
                        : 'bg-gray-300'
                    } text-white`}
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center">
                  <Volume2 className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-purple-400 to-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCurrentSong({ title: 'Focus Flow', artist: 'Ambient Beats' })}
                  className={`text-xs p-2 rounded ${
                    currentSong.title === 'Focus Flow'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Focus Flow
                </button>
                <button
                  onClick={() => setCurrentSong({ title: 'Study Session', artist: 'Lo-Fi Labs' })}
                  className={`text-xs p-2 rounded ${
                    currentSong.title === 'Study Session'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Study Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

       
        {/* Header with 3D effect */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ perspective: '1000px' }}
          className="relative mb-8"
        >
          <motion.div
            className={`flex flex-col relative rounded-3xl overflow-hidden shadow-2xl ${
              darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-indigo-600 to-purple-700'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ rotateX: 5, rotateY: 5, transition: { duration: 0.5 } }}
          >
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent" style={{ backgroundSize: '100% 100%' }}></div>
              <div className="absolute w-full h-32 bottom-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="p-8 md:p-10 z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner`}>
                    <Calendar className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-white">Your Live Sessions</h2>
                    <p className="text-white/80 mt-1 md:text-lg">Manage your virtual classes</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl shadow-lg">
                    {meetings.length} Sessions
                  </div>
                </div>
              </div>
            </div>

            {/* Abstract animated shapes in background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`shape-${i}`}
                  className="absolute opacity-20"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 200 + 50}px`,
                    height: `${Math.random() * 200 + 50}px`,
                    borderRadius: Math.random() > 0.5 ? '50%' : `${Math.random() * 40}%`,
                    background: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`,
                    filter: `blur(${Math.random() * 40 + 20}px)`,
                  }}
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    rotate: [0, Math.random() * 360],
                    scale: [1, Math.random() * 0.5 + 0.8],
                  }}
                  transition={{
                    duration: Math.random() * 20 + 15,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Tab navigation */}
          <div className="flex justify-center -mt-5 relative z-20">
            <motion.div
              className={`flex gap-1 p-1 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {['all', 'upcoming', 'past'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg capitalize font-medium transition-all ${
                    activeTab === tab
                      ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-600'} text-white shadow-md`
                      : `${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`${darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'} border p-4 mb-6 rounded-xl animate-pulse`}
            >
              <div className="flex items-center">
                <X className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'} mr-2`} />
                <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center h-60"
          >
            <div className="relative">
              <div className={`absolute inset-0 ${darkMode ? 'border-indigo-800/30' : 'border-indigo-200'} border-8 rounded-full`}></div>
              <div
                className="w-20 h-20 rounded-full border-4 border-t-4 border-l-4 animate-spin border-transparent"
                style={{
                  borderTopColor: darkMode ? '#818cf8' : '#4f46e5',
                  borderLeftColor: darkMode ? '#818cf8' : '#4f46e5',
                }}
              ></div>
            </div>
            <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading your sessions...</p>
          </motion.div>
        ) : (
          <div>
            {/* Meetings list with enhanced card design */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}
            >
              {filteredMeetings.length === 0 ? (
                <div className={`p-10 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: [0.8, 1.1, 1],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{ duration: 2 }}
                  >
                    <Calendar className="w-16 h-16 mx-auto mb-3" />
                  </motion.div>
                  <p className="text-lg">
                    {activeTab === 'upcoming'
                      ? 'No upcoming meetings found.'
                      : activeTab === 'past'
                      ? 'No past meetings found.'
                      : 'No meetings found.'}
                  </p>
                  <p className={`mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Schedule a meeting to get started.</p>
                </div>
              ) : (
                <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {filteredMeetings.map((meeting, index) => (
                    <motion.li
                      key={meeting.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} transition-all overflow-hidden`}
                    >
                      <motion.div className="p-5" whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="md:w-16 flex-shrink-0">
                            <div
                              className={`w-14 h-14 rounded-xl ${
                                darkMode ? 'bg-gray-700' : 'bg-indigo-100'
                              } flex items-center justify-center`}
                            >
                              {meeting.starred ? (
                                <Star className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                              ) : (
                                <Calendar className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {meeting.sujet}
                              </h3>
                              {meeting.starred && (
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${
                                    darkMode ? 'bg-yellow-700/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  Featured
                                </span>
                              )}
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm">
                              <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(meeting.dateCreation)}
                              </span>

                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  darkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {meeting.classNom}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-3 mt-3 md:mt-0">
                            <div
                              className={`px-3 py-2 rounded-lg font-medium ${
                                darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                              }`}
                            >
                              {timeUntilMeeting(meeting.dateCreation)}
                            </div>
                            <a
                                href={`${meeting.joinUrl}`}
                                target="_blank"
                                className={`flex items-center gap-2 px-3 py-2 text-white rounded-lg shadow transition-all bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M15 10l5 5-5 5" />
                                  <path d="M4 4v7a4 4 0 0 0 4 4h12" />
                                </svg>
                                Join
                              </a>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDeleteMeeting(meeting.id)}
                                className={`flex items-center gap-2 px-3 py-2 text-white rounded-lg shadow transition-all bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800`}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        )}

        {/* Expandable Quick Tips Section */}
        <motion.div
          className={`mt-8 rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          animate={{ height: isExpanded ? 'auto' : '80px' }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-full p-4 flex items-center justify-between ${
              darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-50'
            } transition-colors`}
          >
            <div className="flex items-center">
              <div className={`p-2 mr-3 rounded-lg ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">Session Management Tips</span>
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`p-4 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: 'Organize Sessions',
                      tip: 'Keep your sessions well-organized with clear titles and schedules.',
                      icon: Calendar,
                      color: 'from-blue-500 to-blue-700',
                    },
                    {
                      title: 'Engage Attendees',
                      tip: 'Prepare interactive content to keep participants engaged.',
                      icon: Users,
                      color: 'from-amber-500 to-amber-700',
                    },
                    {
                      title: 'Update Regularly',
                      tip: 'Update session details promptly to avoid confusion.',
                      icon: Edit2,
                      color: 'from-purple-500 to-purple-700',
                    },
                  ].map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}
                    >
                      <div className={`w-10 h-10 mb-3 rounded-lg bg-gradient-to-r ${tip.color} flex items-center justify-center`}>
                        <tip.icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tip.title}</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{tip.tip}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer with floating action buttons */}
        <motion.div
          className="mt-8 text-center relative h-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-3 p-2 rounded-full shadow-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {[
              { icon: Calendar, label: 'Schedule', color: 'from-blue-600 to-indigo-600' },
              { icon: Users, label: 'Participants', color: 'from-pink-600 to-purple-600' },
            ].map((button, i) => (
              <motion.button
                key={i}
                className={`p-3 rounded-full bg-gradient-to-r ${button.color} text-white shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <button.icon className="w-5 h-5" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(10px, -20px) scale(0.8);
            opacity: 0.4;
          }
          100% {
            transform: translate(20px, -40px) scale(0);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(229, 62, 62, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(229, 62, 62, 0);
          }
        }
        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.4;
          }
        }
        .fade-in-out {
          animation: fadeInOut 3s infinite ease-in-out;
        }

        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default MeetingList;