import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/prof';

class AnnouncementService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  // Get auth headers with token
  getAuthHeaders() {
    return {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };
  }

  // Get all announcements for a professor
  async getAnnouncements() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/annonces`, 
        { 
          params: { id_prof: this.user.id },
          ...this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  }

  // Get announcements for a specific class
  async getAnnouncementsByClass(classId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/annonces/classe`, 
        {
          params: { id_classe: classId },
          ...this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching class announcements:', error);
      throw error;
    }
  }

  // Get announcements by professor and class
  async getAnnouncementsByProfAndClass(classId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/annonces/prof/classe`, 
        {
          params: { 
            id_prof: this.user.id,
            id_classe: classId 
          },
          ...this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements by prof and class:', error);
      throw error;
    }
  }

  // Get a single announcement by ID
  async getAnnouncementById(id) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/annonce/${id}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching announcement ${id}:`, error);
      throw error;
    }
  }

  // Create a new announcement
  async createAnnouncement(announcementData, classId, files = []) {
    try {
      // Create form data for file upload if needed
      const formData = new FormData();
      
      // Add announcement data
      formData.append('annonce', JSON.stringify({
        titre: announcementData.titre,
        description: announcementData.description,
        contenu: announcementData.contenu,
        datePublication: new Date()
      }));
      
      // Add files if present
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('fichiers', file);
        });
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/annonce?id_prof=${this.user.id}&id_classe=${classId}`,
        formData,
        {
          ...this.getAuthHeaders(),
          headers: {
            ...this.getAuthHeaders().headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  // Update an existing announcement
  async updateAnnouncement(id, announcementData) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/annonce/${id}`,
        announcementData,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating announcement ${id}:`, error);
      throw error;
    }
  }

  // Delete an announcement
  async deleteAnnouncement(id) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/annonce/${id}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting announcement ${id}:`, error);
      throw error;
    }
  }
}

export default new AnnouncementService();