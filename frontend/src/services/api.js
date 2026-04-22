import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // #region agent log
        fetch('http://127.0.0.1:7429/ingest/860c1e93-04d7-494b-8f7c-ce92bf59e777',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4d38f5'},body:JSON.stringify({sessionId:'4d38f5',runId:'pre-fix',hypothesisId:'H1',location:'src/services/api.js:request',message:'API request',data:{baseURL:config.baseURL,url:config.url,method:config.method,hasAuthHeader:!!config.headers?.Authorization,hasTokenInStorage:!!token},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // #region agent log
        fetch('http://127.0.0.1:7429/ingest/860c1e93-04d7-494b-8f7c-ce92bf59e777',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4d38f5'},body:JSON.stringify({sessionId:'4d38f5',runId:'pre-fix',hypothesisId:'H1',location:'src/services/api.js:response',message:'API response',data:{url:response.config?.url,method:response.config?.method,status:response.status},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        return response;
    },
    (error) => {
        // #region agent log
        fetch('http://127.0.0.1:7429/ingest/860c1e93-04d7-494b-8f7c-ce92bf59e777',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4d38f5'},body:JSON.stringify({sessionId:'4d38f5',runId:'pre-fix',hypothesisId:'H1',location:'src/services/api.js:error',message:'API error',data:{url:error.config?.url,method:error.config?.method,status:error.response?.status,code:error.code,message:error.message},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
        }
        return Promise.reject(error);
    }
);

export default api;
