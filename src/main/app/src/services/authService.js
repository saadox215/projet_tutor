const AuthService = {
    // Set up axios with interceptors for JWT tokens
    setAuthToken: (token) => {
      if (token) {
        localStorage.setItem('token', token);
        // Set default headers for axios or fetch if you're using them
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        // Delete auth header
        // delete axios.defaults.headers.common['Authorization'];
      }
    },
  
    // Get current authentication token
    getToken: () => {
      return localStorage.getItem('token');
    },
  
    // Check if user is authenticated
    isAuthenticated: () => {
      return !!localStorage.getItem('token');
    },
  
    // Get user info from token (basic decoder)
    getUserInfo: () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
      } catch (e) {
        return null;
      }
    },
    
    // Logout user
    logout: () => {
      localStorage.removeItem('token');
      // Clear any app state if needed
      // store.dispatch({ type: 'LOGOUT' });
    },
    
    // Make authenticated API requests
    authFetch: async (url, options = {}) => {
      const token = localStorage.getItem('token');
      
      const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
      
      try {
        const response = await fetch(url, {
          ...options,
          headers
        });
        
        if (response.status === 401) {
          // Token expired or invalid
          AuthService.logout();
          window.location.href = '/login';
          throw new Error('Authentication expired');
        }
        
        return response;
      } catch (error) {
        console.error('Auth fetch error:', error);
        throw error;
      }
    }
  };
  
  export default AuthService;