// /**
//  * API Client for Avolta Backend
//  */
// const API_BASE_URL = 'http://localhost:8090/api';

// export const api = {
//   async request(endpoint: string, options: RequestInit = {}) {
//     const token = localStorage.getItem('token');
//     const headers = {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     };

//     try {
//       console.log(`API Request: ${options.method || 'GET'} ${endpoint}`);
//       const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         ...options,
//         headers,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log(`API Response:`, data);
//       return data;
//     } catch (error) {
//       console.error(`API Error for ${endpoint}:`, error);
//       throw error;
//     }
//   },

//   // Auth
//   async login(email: string, password: string) {
//     return this.request('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     });
//   },

//   // Publications
//   async getPublications() {
//     return this.request('/publications');
//   },

//   async getActivePublications() {
//     return this.request('/publications/public/active');
//   },

//   async createPublication(data: any) {
//     return this.request('/publications', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   async updatePublication(id: string, data: any) {
//     return this.request(`/publications/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   },

//   async deletePublication(id: string) {
//     return this.request(`/publications/${id}`, {
//       method: 'DELETE',
//     });
//   },

//   // Newsletter
//   async subscribeNewsletter(data: any) {
//     return this.request('/newsletter/subscribe', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   async getSubscribers() {
//     return this.request('/newsletter/subscribers');
//   },

//   // Users
//   async getUsers() {
//     return this.request('/users');
//   },

//   async createUser(data: any) {
//     return this.request('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   async updateUserStatus(id: string, status: string) {
//     return this.request(`/users/${id}/status`, {
//       method: 'PUT',
//       body: JSON.stringify({ status }),
//     });
//   },
// };
