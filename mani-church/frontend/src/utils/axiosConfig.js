import { refreshToken, logout, isTokenValid } from './authUtils';
import { getAuthHeader } from '../config/api';

// Remove the trailing slash to avoid double slashes when concatenating
const API_BASE_URL = 'http://localhost:5000';

// Custom fetch wrapper with similar API to axios
const fetchWrapper = {
  // GET request
  get: async (url) => {
    try {
      // Check if token is valid, try to refresh if needed
      if (!isTokenValid()) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          // If refresh failed, redirect to login
          logout();
          throw new Error('Authentication failed');
        }
      }
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      if (!response.ok) {
        // Handle 401 errors
        if (response.status === 401) {
          // Try to refresh the token
          const refreshed = await refreshToken();
          
          if (refreshed) {
            // If token refresh was successful, retry the request
            return fetchWrapper.get(url);
          } else {
            // If refresh failed, logout
            logout();
            throw new Error('Authentication failed');
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
  
  // POST request
  post: async (url, body, options = {}) => {
    try {
      // Check if token is valid, try to refresh if needed
      if (!isTokenValid()) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          // If refresh failed, redirect to login
          logout();
          throw new Error('Authentication failed');
        }
      }
      
      const isFormData = body instanceof FormData;
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          ...(!isFormData && { 'Content-Type': 'application/json' }),
          ...getAuthHeader()
        },
        body: isFormData ? body : JSON.stringify(body)
      });
      
      if (!response.ok) {
        // Handle 401 errors
        if (response.status === 401) {
          // Try to refresh the token
          const refreshed = await refreshToken();
          
          if (refreshed) {
            // If token refresh was successful, retry the request
            return fetchWrapper.post(url, body, options);
          } else {
            // If refresh failed, logout
            logout();
            throw new Error('Authentication failed');
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
  
  // DELETE request
  delete: async (url) => {
    try {
      // Check if token is valid, try to refresh if needed
      if (!isTokenValid()) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          // If refresh failed, redirect to login
          logout();
          throw new Error('Authentication failed');
        }
      }
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      if (!response.ok) {
        // Handle 401 errors
        if (response.status === 401) {
          // Try to refresh the token
          const refreshed = await refreshToken();
          
          if (refreshed) {
            // If token refresh was successful, retry the request
            return fetchWrapper.delete(url);
          } else {
            // If refresh failed, logout
            logout();
            throw new Error('Authentication failed');
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return { status: response.status };
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
};

export default fetchWrapper;