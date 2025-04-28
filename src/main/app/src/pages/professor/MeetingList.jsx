import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Typography, Box, Alert } from '@mui/material';

const MeetingList = ({ token}) => {
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState(null);

  const fetchMeetings = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8081/api/prof/live-streaming/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch meetings');
      }

      const data = await response.json();
      setMeetings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMeetings();
    }
  }, [token]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Scheduled Meetings
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <List>
        {meetings.length === 0 ? (
          <Typography>No meetings found.</Typography>
        ) : (
          meetings.map((meeting) => (
            <ListItem key={meeting.id} divider>
              <ListItemText
                primary={meeting.sujet}
                secondary={`Start: ${new Date(meeting.dateCreation).toLocaleString()}`}
              />
              {meeting.joinUrl && (
                <Button
                  variant="outlined"
                  color="primary"
                  href={meeting.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Meeting
                </Button>
              )}
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default MeetingList;
