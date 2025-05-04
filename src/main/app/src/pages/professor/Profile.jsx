import { useState, useEffect } from "react";
import { User, Mail, Key, Eye, EyeOff, Save, RefreshCw, CheckCircle, AlertTriangle, Edit } from "lucide-react";

// Base API URL
const API_URL = "http://localhost:8081/api/prof/profile";

export default function Profile() {
  const [profileData, setProfileData] = useState({
    name: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");
  
  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Check if passwords match
  useEffect(() => {
    if (profileData.password && profileData.confirmPassword) {
      setPasswordMatch(profileData.password === profileData.confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [profileData.password, profileData.confirmPassword]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/get`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setProfileData({
        name: data.name || "",
        prenom: data.prenom || "",
        email: data.email || "",
        password: "",
        confirmPassword: ""
      });
      setOriginalData({
        name: data.name || "",
        prenom: data.prenom || "",
        email: data.email || ""
      });
      setError(null);
    } catch (err) {
      setError("Failed to load profile data. Please try again.");
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (profileData.password && !passwordMatch) {
      setError("Passwords don't match!");
      return;
    }
    
    setIsLoading(true);
    try {
      // Only send password if it's been changed
      const dataToSend = {
        name: profileData.name,
        prenom: profileData.prenom,
        email: profileData.email
      };
      
      if (profileData.password) {
        dataToSend.password = profileData.password;
      }
      
      const response = await fetch(`${API_URL}/update`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      setOriginalData({
        name: profileData.name,
        prenom: profileData.prenom,
        email: profileData.email
      });
      
      setProfileData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
      
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditing = () => {
    if (isEditing) {
      // Reset form if canceling edit
      setProfileData({
        name: originalData.name || "",
        prenom: originalData.prenom || "",
        email: originalData.email || "",
        password: "",
        confirmPassword: ""
      });
    }
    setIsEditing(!isEditing);
  };

  const resetForm = () => {
    fetchProfileData();
    setIsEditing(false);
  };

  if (isLoading && !profileData.name) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-screen bg-transapent">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-t-3xl shadow-lg p-8 mb-1 transform transition-all duration-500 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-800">Professor Profile</h1>
            <button
              onClick={toggleEditing}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                isEditing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isEditing ? (
                <>Cancel</>
              ) : (
                <>
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="bg-indigo-100 p-6 rounded-xl mb-8">
            <div className="flex items-center">
              <div className="bg-indigo-600 text-white rounded-full p-4">
                <User className="w-10 h-10" />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-semibold">
                  {profileData.prenom} {profileData.name}
                </h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {profileData.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-1 flex items-center shadow-md">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-1 flex items-center shadow-md">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-b-3xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={profileData.prenom}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`
                      block w-full px-4 py-3 rounded-lg border 
                      ${isEditing ? "border-indigo-300" : "border-gray-200"}
                      focus:ring-indigo-500 focus:border-indigo-500
                      ${!isEditing ? "bg-gray-50" : "bg-white"}
                      transition-all duration-300
                    `}
                    placeholder="Your first name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`
                      block w-full px-4 py-3 rounded-lg border 
                      ${isEditing ? "border-indigo-300" : "border-gray-200"}
                      focus:ring-indigo-500 focus:border-indigo-500
                      ${!isEditing ? "bg-gray-50" : "bg-white"}
                      transition-all duration-300
                    `}
                    placeholder="Your last name"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-10 py-3 rounded-lg border border-indigo-300 
                                focus:ring-indigo-500 focus:border-indigo-500
                    ${isEditing ? "border-indigo-300" : "border-gray-200"}
                    focus:ring-indigo-500 focus:border-indigo-500
                    ${!isEditing ? "bg-gray-50" : "bg-white"}
                    transition-all duration-300
                  `}
                  placeholder="yourEmail@gmail.com"
                />
              </div>
            </div>
            
            {/* Password Fields - Only visible when editing */}
            {isEditing && (
              <>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password (leave blank to keep current)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={profileData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-3 rounded-lg border border-indigo-300 
                                focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="New password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={profileData.confirmPassword}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 py-3 rounded-lg border 
                                ${passwordMatch ? "border-indigo-300" : "border-red-500"} 
                                focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="Confirm new password"
                    />
                    {!passwordMatch && (
                      <p className="mt-1 text-sm text-red-600">Passwords don't match</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isLoading || (profileData.password && !passwordMatch)}
                  className={`
                    flex items-center px-6 py-2 rounded-lg text-white
                    ${
                      isLoading || (profileData.password && !passwordMatch)
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }
                    transition-all duration-300 shadow-md hover:shadow-lg
                  `}
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
        
        {/* Decorative Elements */}
        <div className="flex justify-center mt-8">
          <div className="w-16 h-1 bg-indigo-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}