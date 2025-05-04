import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, ChevronRight, Clock, FileText, Video, X, Book, FileQuestion, BarChart2, Loader, Moon, Sun } from 'lucide-react';

// Main dashboard component
export default function ProfesseurDashboard() {
  const [profile, setProfile] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [qcms, setQcms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in. Please log in to continue.');
      setLoading(false);
      return;
    }

    const fetchFromApi = async (url) => {
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (err) {
        console.error(`Error fetching from ${url}:`, err);
        return null;
      }
    };

    const fetchAllData = async () => {
      try {
        const [profileData, announcementsData, liveStreamsData, qcmsData, classesData] = await Promise.all([
          fetchFromApi('http://localhost:8081/api/prof/profile/get'),
          fetchFromApi('http://localhost:8081/api/prof/annonces/professeur/email'),
          fetchFromApi('http://localhost:8081/api/prof/live-streaming/all'),
          fetchFromApi('http://localhost:8081/api/prof/evaluation/qcms'),
          fetchFromApi('http://localhost:8081/api/prof/annonces/professeur/classes')
        ]);

        setProfile(profileData);
        setAnnouncements(announcementsData || []);
        setLiveStreams(liveStreamsData || []);
        setQcms(qcmsData || []);
        setClasses(classesData || []);

        if (classesData && classesData.length > 0) {
          const exercicesPromises = classesData.map(classe => 
            fetchFromApi(`http://localhost:8081/api/prof/exercices/classe/${classe.id}`)
          );
          const exercicesResults = await Promise.all(exercicesPromises);
          const allExercices = exercicesResults.flat().filter(Boolean);
          setExercices(allExercices);
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-transparent' : 'bg-transparent'}`}>
      <div className="container mx-auto py-6 px-4">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <WelcomeSection profile={profile} />
         
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-6">
            <TabButton 
              active={selectedTab === 'overview'} 
              onClick={() => setSelectedTab('overview')}
              icon={<BarChart2 size={18} />}
              label="Overview"
            />
          </nav>
        </div>

        {/* Dashboard Content */}
        <AnimatePresence>
          {selectedTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-6"
            >
              <DashboardStatsGrid 
                classes={classes} 
                exercices={exercices} 
                liveStreams={liveStreams}
                qcms={qcms}
                announcements={announcements}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <RecentAnnouncements announcements={announcements} />
                  <UpcomingLiveStreams liveStreams={liveStreams} />
                </div>
                <div className="md:col-span-1">
                  <RecentlyAddedContent exercices={exercices} qcms={qcms} />
                  <ClassesList classes={classes} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`pb-4 px-2 flex items-center ${
        active 
          ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium dark:text-indigo-400 dark:border-indigo-400' 
          : 'text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400'
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </motion.button>
  );
}

// Welcome Section
function WelcomeSection({ profile }) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-8"
    >
      <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
        {greeting()}, <span className="text-indigo-600 dark:text-indigo-400">{profile?.prenom || 'Professor'}</span>!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">{today}</p>
    </motion.div>
  );
}

// Loading State
function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-center"
      >
        <Loader className="h-16 w-16 mx-auto text-indigo-600 dark:text-indigo-400" />
        <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">Crafting Your Dashboard...</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">One moment while we bring it to life!</p>
      </motion.div>
    </div>
  );
}

// Error State
function ErrorState({ message }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
      >
        <X className="h-16 w-16 mx-auto text-red-500" />
        <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">Oops, Something Broke!</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{message}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          onClick={() => window.location.reload()}
        >
          Try Again
        </motion.button></motion.div>
      </div>
    
  );
}

// Dashboard Stats Grid
function DashboardStatsGrid({ classes, exercices, liveStreams, qcms, announcements }) {
  const stats = [
    {
      title: "Classes",
      value: classes.length,
      icon: <Book className="text-blue-600 dark:text-blue-400" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Live Sessions",
      value: liveStreams.length,
      icon: <Video className="text-purple-600 dark:text-purple-400" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Exercises",
      value: exercices.length,
      icon: <FileText className="text-green-600 dark:text-green-400" />,
      color: "from-green-500 to-green-600",
    },
    {
      title: "QCMs",
      value: qcms.length,
      icon: <FileQuestion className="text-amber-600 dark:text-amber-400" />,
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Announcements",
      value: announcements.length,
      icon: <Bell className="text-red-600 dark:text-red-400" />,
      color: "from-red-500 to-red-600",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-between transform transition-all duration-300"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stat.value}</p>
          </div>
          <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
            {stat.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Recent Announcements
function RecentAnnouncements({ announcements }) {
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Latest Announcements</h2>
        <ChevronRight className="text-gray-400 dark:text-gray-500" />
      </div>
      
      {recentAnnouncements.length > 0 ? (
        <div className="space-y-4">
          {recentAnnouncements.map((announcement, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 5 }}
              className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">{announcement.titre}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(announcement.datePublication).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{announcement.contenu}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No recent announcements</p>
      )}
    </motion.div>
  );
}

// Upcoming Live Streams
function UpcomingLiveStreams({ liveStreams }) {
  const today = new Date();
  const upcomingStreams = liveStreams
    .filter(stream => new Date(stream.dateCreation) > today)
    .sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation))
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Upcoming Live Sessions</h2>
        <ChevronRight className="text-gray-400 dark:text-gray-500" />
      </div>
      
      {upcomingStreams.length > 0 ? (
        <div className="space-y-4">
          {upcomingStreams.map((stream, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex-shrink-0 h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                <Video className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">{stream.sujet}</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>{new Date(stream.dateCreation).toLocaleDateString()}</span>
                  <Clock size={14} className="ml-3 mr-1" />
                  <span>{new Date(stream.dateCreation).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={stream.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-800"
              >
                Join
              </motion.a>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming live sessions</p>
      )}
    </motion.div>
  );
}

// Recently Added Content
function RecentlyAddedContent({ exercices, qcms }) {
  const allContent = [
    ...exercices.map(ex => ({ 
      ...ex, 
      type: 'exercise',
      date: new Date(ex.datePub)
    })),
    ...qcms.map(qcm => ({ 
      ...qcm, 
      type: 'qcm',
      date: new Date(qcm.dateCreation)
    }))
  ].sort((a, b) => b.date - a.date).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Recently Added</h2>
      
      {allContent.length > 0 ? (
        <div className="space-y-3">
          {allContent.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 5 }}
              className="flex items-center py-2"
            >
              <div className={`p-2 rounded-md mr-3 ${
                item.type === 'exercise' ? 'bg-green-100 dark:bg-green-900' : 'bg-amber-100 dark:bg-amber-900'
              }`}>
                {item.type === 'exercise' ? 
                  <FileText size={16} className="text-green-600 dark:text-green-400" /> : 
                  <FileQuestion size={16} className="text-amber-600 dark:text-amber-400" />
                }
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.titre}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.date.toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No content added recently</p>
      )}
    </motion.div>
  );
}

// Classes List
function ClassesList({ classes }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Your Classes</h2>
      
      {classes.length > 0 ? (
        <div className="space-y-3">
          {classes.map((classe, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03, rotate: 1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transform transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md mr-3">
                  <Book size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{classe.name}</span>
              </div>
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 py-1 px-2 rounded-full">
                {classe.capacite} students
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No classes assigned</p>
      )}
    </motion.div>
  );
}