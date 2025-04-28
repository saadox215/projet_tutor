import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
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

const CreateMeetingForm = ({token }) => {
  const [subject, setSubject] = useState('');
  const [startTime, setStartTime] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [classId, setClassId] = useState(null);
   const [classes, setClasses] = useState([]);
   useEffect(() => {
      fetchClasses();
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    let formattedStartTime;
    try {
      formattedStartTime = new Date(startTime).toISOString();
    } catch (err) {
      setError('Invalid start time format');
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

      let errorData;
      if (!response.ok) {
        try {
          errorData = await response.json();
          throw new Error(errorData.error || `Failed to create meeting (Status: ${response.status})`);
        } catch (jsonErr) {
          const text = await response.text();
          throw new Error(text || `Failed to create meeting (Status: ${response.status})`);
        }
      }

      const data = await response.json();
      setSuccess(`Meeting created successfully! Join URL: ${data.join_url}`);
      setSubject('');
      setStartTime('');
    } catch (err) {
      setError(err.message);
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
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create a New Zoom Meeting
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TextField
        label="Meeting Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Class <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="classId"
                              value={classId}
                              onChange={(e) => setClassId(e.target.value)}
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
      <TextField
        label="Start Time"
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        fullWidth
        required
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Create Meeting
      </Button>
    </Box>
  );
};

export default CreateMeetingForm;
