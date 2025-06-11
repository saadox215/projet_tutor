import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  ChartBarIcon,
  TrophyIcon,
  BookOpenIcon,
  FireIcon,
  StarIcon,
  LockClosedIcon,
  LockOpenIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  EyeIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BeakerIcon,
  PuzzlePieceIcon,
  LightBulbIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

const StudentQcmPage = () => {
  const [qcms, setQcms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQcm, setSelectedQcm] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [filter, setFilter] = useState("all"); // all, completed, pending
  const [hoveredCard, setHoveredCard] = useState(null);

  // Fetch available QCMs
  useEffect(() => {
    fetchQcms();
  }, []);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleQuizSubmit();
    }
  }, [timeLeft, quizStarted]);

  const fetchQcms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch available QCMs for student
      const response = await fetch("http://localhost:8081/api/etudiant/qcms", {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch QCMs");
      
      const data = await response.json();
      setQcms(data);
    } catch (error) {
      console.error("Error fetching QCMs:", error);
      // Dummy data for development
      setQcms([
        {
          id: 1,
          titre: "Introduction to React Hooks",
          professeur: "Dr. Sarah Johnson",
          dateCreation: "2025-01-15",
          duration: 30,
          totalQuestions: 10,
          status: "pending",
          difficulty: "medium",
          category: "Web Development",
          description: "Test your knowledge of React Hooks including useState, useEffect, and custom hooks.",
          attempts: 0,
          maxAttempts: 3
        },
        {
          id: 2,
          titre: "JavaScript ES6+ Features",
          professeur: "Prof. Michael Chen",
          dateCreation: "2025-01-10",
          duration: 45,
          totalQuestions: 15,
          status: "completed",
          score: 85,
          difficulty: "hard",
          category: "Programming",
          description: "Master modern JavaScript features including arrow functions, destructuring, and async/await.",
          attempts: 1,
          maxAttempts: 2
        },
        {
          id: 3,
          titre: "Database Design Fundamentals",
          professeur: "Dr. Emily Rodriguez",
          dateCreation: "2025-01-20",
          duration: 60,
          totalQuestions: 20,
          status: "pending",
          difficulty: "easy",
          category: "Database",
          description: "Learn the basics of database design, normalization, and SQL queries.",
          attempts: 0,
          maxAttempts: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (qcm) => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch quiz questions
      const response = await fetch(`http://localhost:8081/api/student/qcms/${qcm.id}/start`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) throw new Error("Failed to start quiz");
      
      const quizData = await response.json();
      setSelectedQcm({
        ...qcm,
        questions: quizData.questions || getDummyQuestions()
      });
      setTimeLeft(qcm.duration * 60); // Convert minutes to seconds
      setQuizStarted(true);
      setCurrentQuestion(0);
      setAnswers({});
    } catch (error) {
      console.error("Error starting quiz:", error);
      // Use dummy questions for development
      setSelectedQcm({
        ...qcm,
        questions: getDummyQuestions()
      });
      setTimeLeft(qcm.duration * 60);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setAnswers({});
    }
  };

  const getDummyQuestions = () => [
    {
      id: 1,
      contenu: "What is the primary purpose of React Hooks?",
      reponses: [
        { id: 1, contenu: "To add state to functional components", correcte: true },
        { id: 2, contenu: "To replace Redux", correcte: false },
        { id: 3, contenu: "To make components faster", correcte: false },
        { id: 4, contenu: "To style components", correcte: false }
      ]
    },
    {
      id: 2,
      contenu: "Which hook is used for side effects in React?",
      reponses: [
        { id: 5, contenu: "useState", correcte: false },
        { id: 6, contenu: "useEffect", correcte: true },
        { id: 7, contenu: "useContext", correcte: false },
        { id: 8, contenu: "useReducer", correcte: false }
      ]
    }
  ];

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedQcm.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizSubmit = async () => {
    // Calculate score
    let correctAnswers = 0;
    selectedQcm.questions.forEach(question => {
      const selectedAnswer = answers[question.id];
      const correctAnswer = question.reponses.find(r => r.correcte);
      if (selectedAnswer === correctAnswer?.id) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / selectedQcm.questions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);
    setShowResults(true);

    // Submit results to server
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8081/api/student/qcms/${selectedQcm.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          score: finalScore,
          timeSpent: (selectedQcm.duration * 60) - timeLeft
        })
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const resetQuiz = () => {
    setSelectedQcm(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setTimeLeft(null);
    fetchQcms(); // Refresh the list
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-emerald-600';
      case 'medium': return 'from-yellow-400 to-orange-600';
      case 'hard': return 'from-red-400 to-pink-600';
      default: return 'from-blue-400 to-indigo-600';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return <BeakerIcon className="w-5 h-5" />;
      case 'medium': return <PuzzlePieceIcon className="w-5 h-5" />;
      case 'hard': return <FireIcon className="w-5 h-5" />;
      default: return <LightBulbIcon className="w-5 h-5" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding! You're a master! 🏆";
    if (score >= 80) return "Excellent work! Keep it up! ⭐";
    if (score >= 70) return "Good job! You're doing great! 👍";
    if (score >= 60) return "Nice effort! Room for improvement! 📚";
    return "Keep practicing! You'll get there! 💪";
  };

  const filteredQcms = qcms.filter(qcm => {
    if (filter === 'all') return true;
    if (filter === 'completed') return qcm.status === 'completed';
    if (filter === 'pending') return qcm.status === 'pending';
    return true;
  });

  // Main quiz interface
  if (selectedQcm && quizStarted && !showResults) {
    const question = selectedQcm.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQcm.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Quiz Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedQcm.titre}</h2>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <ClockIcon className="w-5 h-5" />
                <span className="font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Question {currentQuestion + 1} of {selectedQcm.questions.length}
            </p>
          </motion.div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {question.contenu}
            </h3>

            <div className="space-y-4">
              {question.reponses.map((reponse, index) => (
                <motion.button
                  key={reponse.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswerSelect(question.id, reponse.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all transform hover:scale-102 ${
                    answers[question.id] === reponse.id
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      answers[question.id] === reponse.id
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-400'
                    }`}>
                      {answers[question.id] === reponse.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 bg-white rounded-full"
                        />
                      )}
                    </div>
                    <span className="text-left text-gray-700">{reponse.contenu}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:scale-105'
                }`}
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Previous
              </button>

              <button
                onClick={() => {
                  const allAnswered = selectedQcm.questions.every(q => answers[q.id]);
                  if (!allAnswered) {
                    alert("Please answer all questions before submitting!");
                    return;
                  }
                  if (window.confirm("Are you sure you want to submit your quiz?")) {
                    handleQuizSubmit();
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Submit Quiz
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === selectedQcm.questions.length - 1}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  currentQuestion === selectedQcm.questions.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                Next
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>

          {/* Question Navigator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 bg-white rounded-xl shadow-lg p-4"
          >
            <p className="text-sm font-medium text-gray-600 mb-3">Question Navigator</p>
            <div className="flex flex-wrap gap-2">
              {selectedQcm.questions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentQuestion === index
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : answers[q.id]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
        >
          <div className="text-center">
            {/* Score Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="mb-6"
            >
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${
                score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
            <p className="text-xl text-gray-600 mb-6">{getScoreMessage(score)}</p>

            {/* Stars Rating */}
            <div className="flex justify-center mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: star * 0.1 }}
                >
                  {score >= star * 20 ? (
                    <StarSolid className="w-8 h-8 text-yellow-400" />
                  ) : (
                    <StarIcon className="w-8 h-8 text-gray-300" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-indigo-50 rounded-xl p-4">
                <CheckCircleIcon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Correct</p>
                <p className="text-xl font-bold text-indigo-600">
                  {Math.round((score / 100) * selectedQcm.questions.length)}
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <XCircleIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Incorrect</p>
                <p className="text-xl font-bold text-red-600">
                  {selectedQcm.questions.length - Math.round((score / 100) * selectedQcm.questions.length)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <ClockIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-xl font-bold text-purple-600">
                  {formatTime((selectedQcm.duration * 60) - timeLeft)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Back to Quizzes
              </button>
              <button
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transform hover:scale-105 transition-all"
              >
                View Answers
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main QCM list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center">
              <RocketLaunchIcon className="w-12 h-12 mr-4" />
              Quiz Center
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Challenge yourself with interactive quizzes and track your learning progress
            </p>
            
            {/* Stats */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-blue bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-30"
              >
                <TrophyIcon className="w-10 h-10 text-yellow-300 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-indigo-100">Quizzes Completed</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-blue bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-30"
              >
                <ChartBarIcon className="w-10 h-10 text-green-300 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">78%</p>
                <p className="text-indigo-100">Average Score</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-30"
              >
                <FireIcon className="w-10 h-10 text-orange-300 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">5</p>
                <p className="text-indigo-100">Day Streak</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" viewBox="0 0 1440 74" preserveAspectRatio="none">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,56C672,48,768,32,864,26.7C960,21,1056,27,1152,32C1248,37,1344,43,1392,45.3L1440,48L1440,74L1392,74C1344,74,1248,74,1152,74C1056,74,960,74,864,74C768,74,672,74,576,74C480,74,384,74,288,74C192,74,96,74,48,74L0,74Z" 
              fill="url(#gradient)" fillOpacity="1">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EEF2FF" />
                  <stop offset="50%" stopColor="#FAF5FF" />
                  <stop offset="100%" stopColor="#FDF2F8" />
                </linearGradient>
              </defs>
            </path>
          </svg>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-2 inline-flex"
        >
          {['all', 'pending', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === tab
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Quiz Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <SparklesIcon className="w-12 h-12 text-purple-600" />
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQcms.map((qcm, index) => (
              <motion.div
                key={qcm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(qcm.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative"
              >
                <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 ${
                  hoveredCard === qcm.id ? 'scale-105 shadow-2xl' : ''
                }`}>
                  {/* Card Header with Gradient */}
                  <div className={`h-32 bg-gradient-to-r ${getDifficultyColor(qcm.difficulty)} p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                    <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 inline-flex">
                          {getDifficultyIcon(qcm.difficulty)}
                        </div>
                        {qcm.status === 'completed' ? (
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-1">
                            <span className="text-white font-semibold">{qcm.score}%</span>
                          </div>
                        ) : (
                          <LockOpenIcon className="w-6 h-6 text-white opacity-60" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {qcm.titre}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {qcm.dateCreation}
                    </p>

                    {/* Meta Information */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <AcademicCapIcon className="w-4 h-4 mr-2" />
                        <span>{qcm.nomProfesseur}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        <span>{qcm.duration} minutes • {qcm.totalQuestions} questions</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpenIcon className="w-4 h-4 mr-2" />
                        <span>{qcm.category}</span>
                      </div>
                    </div>

                    {/* Progress or Start Button */}
                    {qcm.status === 'completed' ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Your Score</span>
                          <span className={`text-lg font-bold ${getScoreColor(qcm.score)}`}>
                            {qcm.score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full ${
                              qcm.score >= 80 ? 'bg-green-500' : 
                              qcm.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${qcm.score}%` }}
                          />
                        </div>
                        <button 
                          onClick={() => startQuiz(qcm)}
                          disabled={qcm.attempts >= qcm.maxAttempts}
                          className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
                            qcm.attempts >= qcm.maxAttempts
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                          }`}
                        >
                          {qcm.attempts >= qcm.maxAttempts ? (
                            <>
                              <LockClosedIcon className="w-5 h-5 mr-2" />
                              Max Attempts Reached
                            </>
                          ) : (
                            <>
                              <ArrowPathIcon className="w-5 h-5 mr-2" />
                              Retake ({qcm.attempts}/{qcm.maxAttempts})
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startQuiz(qcm)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center group"
                      >
                        <PlayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Start Quiz
                      </button>
                    )}

                    {/* Attempts indicator */}
                    <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                      <span>Attempts: {qcm.attempts}/{qcm.maxAttempts}</span>
                      <span className="flex items-center">
                        {[...Array(qcm.maxAttempts)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full mx-0.5 ${
                              i < qcm.attempts ? 'bg-purple-500' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <AnimatePresence>
                    {hoveredCard === qcm.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Floating Badge */}
                {qcm.status === 'completed' && qcm.score >= 90 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: index * 0.1 + 0.3 }}
                    className="absolute -top-3 -right-3 bg-yellow-400 rounded-full p-2 shadow-lg"
                  >
                    <TrophyIcon className="w-6 h-6 text-yellow-900" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredQcms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <QuestionMarkCircleIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No quizzes found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {filter === 'completed' 
                ? "You haven't completed any quizzes yet. Start one to see it here!"
                : filter === 'pending'
                ? "All quizzes have been completed. Great job!"
                : "No quizzes are available at the moment. Check back later!"}
            </p>
          </motion.div>
        )}

        {/* Achievement Section */}
        {!loading && qcms.some(q => q.status === 'completed') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <TrophyIcon className="w-8 h-8 mr-3" />
              Your Achievements
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <StarIcon className="w-12 h-12 mx-auto mb-2 text-yellow-300" />
                <p className="font-bold text-xl">Perfect Score</p>
                <p className="text-sm opacity-90">Score 100% on 3 quizzes</p>
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <FireIcon className="w-12 h-12 mx-auto mb-2 text-orange-300" />
                <p className="font-bold text-xl">On Fire!</p>
                <p className="text-sm opacity-90">5 day streak</p>
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <RocketLaunchIcon className="w-12 h-12 mx-auto mb-2 text-blue-300" />
                <p className="font-bold text-xl">Quick Learner</p>
                <p className="text-sm opacity-90">Complete 10 quizzes</p>
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <SparklesIcon className="w-12 h-12 mx-auto mb-2 text-green-300" />
                <p className="font-bold text-xl">Consistent</p>
                <p className="text-sm opacity-90">Average score above 80%</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentQcmPage;