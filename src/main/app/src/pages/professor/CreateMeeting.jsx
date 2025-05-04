import React, { useEffect, useState, useRef } from 'react';
import {
  Plus,
  X,
  FileText,
  ChevronDown,
  RotateCw,
  GraduationCap,
  Eye,
  Users,
  Video,
  Calendar,
  Copy,
  CheckCheck,
  Sparkles,
  Zap,
  Globe
} from "lucide-react";

const CreateMeetingForm = ({ token }) => {
  const [subject, setSubject] = useState('');
  const [startTime, setStartTime] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [classId, setClassId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');
  const [animateButton, setAnimateButton] = useState(false);
  const [formStage, setFormStage] = useState(0);
  const [formComplete, setFormComplete] = useState(false);
  const formRef = useRef(null);
  
  // Particle effect state
  const [particles, setParticles] = useState([]);
  const [showParticles, setShowParticles] = useState(false);
  
  useEffect(() => {
    fetchClasses();
    
    // Initial animation
    setTimeout(() => {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 3000);
    }, 500);
  }, []);
  
  // Generate particles when form is completed
  useEffect(() => {
    if (formComplete) {
      generateParticles();
    }
  }, [formComplete]);
  
  useEffect(() => {
    if (showParticles) {
      generateParticles();
    } else {
      setParticles([]);
    }
  }, [showParticles]);
  
  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 2,
        color: ['#4f46e5', '#10b981', '#06b6d4', '#8b5cf6'][Math.floor(Math.random() * 4)],
        duration: Math.random() * 2 + 1
      });
    }
    setParticles(newParticles);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    setAnimateButton(true);
    
    let formattedStartTime;
    try {
      formattedStartTime = new Date(startTime).toISOString();
    } catch (err) {
      setError('Invalid start time format');
      setIsLoading(false);
      setAnimateButton(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8081/api/prof/live-streaming?classeId=${classId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sujet: subject,
          dateCreation: formattedStartTime,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to create meeting (Status: ${response.status})`);
      }
      
      const data = await response.json();
      setJoinUrl(data.join_url);
      setSuccess(`Virtual classroom successfully created!`);
      setFormComplete(true);
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setAnimateButton(false);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const nextStage = () => {
    if (formStage < 2) {
      setFormStage(formStage + 1);
    }
  };
  
  const prevStage = () => {
    if (formStage > 0) {
      setFormStage(formStage - 1);
    }
  };
  
  const canProceed = () => {
    if (formStage === 0) return subject.trim().length > 0;
    if (formStage === 1) return classId !== null;
    return startTime.trim().length > 0;
  };
  
  // Background shapes
  const shapes = [
    { top: '10%', left: '-5%', size: '120px', color: 'rgba(79, 70, 229, 0.1)', blur: '50px', type: 'circle' },
    { top: '70%', left: '80%', size: '150px', color: 'rgba(16, 185, 129, 0.1)', blur: '60px', type: 'circle' },
    { top: '40%', left: '90%', size: '100px', color: 'rgba(139, 92, 246, 0.1)', blur: '45px', type: 'circle' },
    { top: '85%', left: '15%', size: '130px', color: 'rgba(6, 182, 212, 0.12)', blur: '55px', type: 'circle' },
  ];
  
  return (
    <div className="relative bg-white p-1 rounded-3xl shadow-2xl max-w-md mx-auto mt-8 overflow-hidden transition-all duration-500">
      {/* Background shapes */}
      {shapes.map((shape, i) => (
        <div 
          key={i} 
          className="absolute rounded-full z-0" 
          style={{
            top: shape.top,
            left: shape.left,
            width: shape.size,
            height: shape.size,
            background: shape.color,
            filter: `blur(${shape.blur})`,
            opacity: 0.8
          }}
        />
      ))}
      
      {/* Particles effect */}
      {showParticles && particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full z-50 opacity-70"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            animation: `float ${particle.duration}s ease-out infinite`
          }}
        />
      ))}
      
      <div className="relative bg-gradient-to-br from-white to-indigo-50 p-8 rounded-3xl shadow-inner z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Create Virtual Class
            </h2>
            <p className="text-gray-500 text-sm">Fast, interactive & engaging</p>
          </div>
          <div className="ml-auto bg-indigo-100 p-2 rounded-full">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs mb-2">
            <span className={`font-medium ${formStage >= 0 ? 'text-indigo-600' : 'text-gray-400'}`}>Subject</span>
            <span className={`font-medium ${formStage >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>Class</span>
            <span className={`font-medium ${formStage >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>Schedule</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 ease-out" 
              style={{ width: `${(formStage + 1) * 33.33}%` }}
            />
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 rounded-xl animate-pulse">
            <div className="flex">
              <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Success message */}
        {success && formComplete && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-6 mb-6 rounded-xl">
            <div className="flex items-center mb-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg mr-3">
                <CheckCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-emerald-800">{success}</h3>
            </div>
            
            {joinUrl && (
              <div className="mt-3">
                <p className="text-xs text-emerald-700 mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-1" /> Share this link with your students:
                </p>
                <div className="flex items-center bg-white rounded-lg overflow-hidden border border-emerald-200 shadow-sm">
                  <input
                    type="text"
                    value={joinUrl}
                    readOnly
                    className="bg-white text-xs p-3 w-full focus:outline-none text-gray-700"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs p-3 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-1 min-w-16 justify-center"
                  >
                    {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="flex justify-center mt-4">
                <a
                                href={`${joinUrl}`}
                                target="_blank"
                                className={`flex items-center px-3 py-2 text-white rounded-lg shadow transition-all bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M15 10l5 5-5 5" />
                                  <path d="M4 4v7a4 4 0 0 0 4 4h12" />
                                </svg>
                                Join Now
                              </a>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Multi-step form */}
        {!formComplete && (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Stage 0: Subject */}
            <div className={`transition-all duration-500 ${formStage === 0 ? 'opacity-100 h-auto' : 'opacity-0 h-0 absolute'}`}>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-indigo-500" />
                  Meeting Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="Enter an engaging topic for your class"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>
            
            {/* Stage 1: Class */}
            <div className={`transition-all duration-500 ${formStage === 1 ? 'opacity-100 h-auto' : 'opacity-0 h-0 absolute'}`}>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-indigo-500" />
                  Target Class <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={classId || ""}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                    className="pl-10 appearance-none w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Select a class</option>
                    {classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>
                        {classe.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stage 2: Schedule */}
            <div className={`transition-all duration-500 ${formStage === 2 ? 'opacity-100 h-auto' : 'opacity-0 h-0 absolute'}`}>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-indigo-500" />
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="pl-10 w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              {formStage > 0 ? (
                <button
                  type="button"
                  onClick={prevStage}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {formStage < 2 ? (
                <button
                  type="button"
                  onClick={nextStage}
                  disabled={!canProceed()}
                  className={`px-6 py-2.5 rounded-xl text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium ${
                    canProceed() 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !canProceed()}
                  className={`px-6 py-2.5 rounded-xl text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium flex items-center gap-2 ${
                    animateButton ? 'animate-pulse' : ''
                  } ${
                    canProceed() && !isLoading
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Class
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
        
        {/* Info footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs">
          <GraduationCap className="w-4 h-4" />
          <span>Students will receive instant notifications</span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          50% { transform: translate(10px, -20px) scale(0.8); opacity: 0.4; }
          100% { transform: translate(20px, -40px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CreateMeetingForm;