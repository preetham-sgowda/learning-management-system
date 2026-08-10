/**
 * Centralized API Service Layer
 * 
 * All frontend-to-backend communication routes through this module.
 * Handles JWT token attachment, automatic token refresh on 401, and
 * graceful error propagation.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://learning-management-system-1-i9my.onrender.com';

// ─── Core fetch wrapper ─────────────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers = [];

function onTokenRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

/**
 * Primary fetch wrapper. Automatically attaches the JWT access token,
 * handles 401 → token refresh → retry, and returns parsed JSON.
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  // Remove Content-Type for FormData (file uploads)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    console.warn(`[API] Network error for ${endpoint}:`, networkError.message);
    throw new ApiError('Network error — backend may be unavailable', 0, null);
  }

  // Handle 401 — attempt token refresh
  if (response.status === 401 && accessToken) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onTokenRefreshed(newToken);
        // Retry original request with new token
        headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, { ...config, headers });
        return handleResponse(retryResponse, endpoint);
      } catch (refreshError) {
        isRefreshing = false;
        // Refresh failed — force logout
        clearAuthTokens();
        throw new ApiError('Session expired — please sign in again', 401, null);
      }
    } else {
      // Another refresh is in progress — queue this request
      return new Promise((resolve, reject) => {
        addRefreshSubscriber(async (newToken) => {
          try {
            headers.Authorization = `Bearer ${newToken}`;
            const retryResponse = await fetch(url, { ...config, headers });
            resolve(handleResponse(retryResponse, endpoint));
          } catch (err) {
            reject(err);
          }
        });
      });
    }
  }

  return handleResponse(response, endpoint);
}

async function handleResponse(response, endpoint) {
  if (response.status === 204) {
    return null; // No content
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      (typeof data === 'object' && data?.message) ||
      (typeof data === 'string' && data) ||
      `API error ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

// ─── Token helpers ──────────────────────────────────────────────────────────

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAuthTokens();
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data.accessToken;
}

export function clearAuthTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('skillforge_token');
}

export function getStoredAccessToken() {
  return localStorage.getItem('accessToken');
}

// ─── Custom Error class ─────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ─── Auth API ───────────────────────────────────────────────────────────────

export const authApi = {
  async login(email, password) {
    return apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(email, password, fullName) {
    return apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
  },

  async refresh(refreshToken) {
    return apiFetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  async requestPasswordReset(email) {
    return apiFetch('/api/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async confirmPasswordReset(token, newPassword) {
    return apiFetch('/api/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// ─── Course API ─────────────────────────────────────────────────────────────

export const courseApi = {
  async listAll() {
    return apiFetch('/api/courses', { method: 'GET' });
  },

  async getById(id) {
    return apiFetch(`/api/courses/${id}`, { method: 'GET' });
  },

  async getModules(courseId) {
    return apiFetch(`/api/courses/${courseId}/modules`, { method: 'GET' });
  },

  async getArticles(moduleId) {
    return apiFetch(`/api/modules/${moduleId}/articles`, { method: 'GET' });
  },

  async markArticleRead(articleId) {
    return apiFetch(`/api/articles/${articleId}/read`, { method: 'PATCH' });
  },
};

// ─── Enrollment API ─────────────────────────────────────────────────────────

export const enrollmentApi = {
  async enroll(courseId) {
    return apiFetch(`/api/courses/${courseId}/enroll`, { method: 'POST' });
  },

  async myEnrollments() {
    return apiFetch('/api/me/enrollments', { method: 'GET' });
  },
};

// ─── Profile API ────────────────────────────────────────────────────────────

export const profileApi = {
  async getMyProfile() {
    return apiFetch('/api/profile/me', { method: 'GET' });
  },
};

// ─── Streak API ─────────────────────────────────────────────────────────────

export const streakApi = {
  async getMyStreak() {
    return apiFetch('/api/streak', { method: 'GET' });
  },

  async getCalendar(start, end) {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    const qs = params.toString();
    return apiFetch(`/api/streak/calendar${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
};

// ─── Question / Assessment API ──────────────────────────────────────────────

export const questionApi = {
  async getPracticeSet(courseId, topic, difficulty, count = 10) {
    const params = new URLSearchParams({ topic });
    if (difficulty) params.append('difficulty', difficulty);
    if (count) params.append('count', String(count));
    return apiFetch(`/api/courses/${courseId}/questions/practice?${params.toString()}`, {
      method: 'GET',
    });
  },
};

export const attemptApi = {
  async submitAnswer(questionId, answer, timeTakenSeconds) {
    return apiFetch(`/api/questions/${questionId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answer, timeTakenSeconds }),
    });
  },

  async submitCode(questionId, code, language) {
    return apiFetch(`/api/questions/${questionId}/submit-code`, {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  },
};

export default {
  authApi,
  courseApi,
  enrollmentApi,
  profileApi,
  streakApi,
  questionApi,
  attemptApi,
  apiFetch,
  clearAuthTokens,
  getStoredAccessToken,
};
