
const API_BASE_URL = 'http://195.80.50.251:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      ...options.headers,
    };

    // Only set JSON content-type if not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      const isJson = (response.headers.get('content-type') || '').includes('application/json');
      if (!response.ok) {
        let error = new Error(`HTTP ${response.status}`);
        if (isJson) {
          const data = await response.json().catch(() => null);
          if (data) {
            error.data = data;
            error.message = data.error || data.detail || error.message;
          }
        } else {
          const text = await response.text().catch(() => '');
          if (text) error.message = text;
        }
        throw error;
      }

      return isJson ? await response.json() : null;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, {
      method: 'POST',
      body,
    });
  }

  async put(endpoint, data) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, {
      method: 'PUT',
      body,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();