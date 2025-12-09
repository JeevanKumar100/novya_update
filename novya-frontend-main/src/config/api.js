/**
 * API Configuration for NOVYA Learning Platform
 * 
 * This app uses a microservices architecture with two backends:
 * 1. Django Backend (LMS_BACK) - Database operations, auth, courses, progress
 * 2. FastAPI Backend (AI_BACKEND) - AI features (quiz generation, chatbot, study plans)
 */

// Backend URLs
const DJANGO_BASE_URL = process.env.REACT_APP_DJANGO_URL || 'http://13.217.84.96:8001/api';
const FASTAPI_BASE_URL = process.env.REACT_APP_FASTAPI_URL || 'http://13.217.84.96:8000';

/**
 * Return the child email stored during parent login (if applicable)
 */
export const getChildEmailForParent = () => {
  try {
    const role = localStorage.getItem('userRole');
    if (role && role.toLowerCase() === 'parent') {
      const childEmail = localStorage.getItem('childEmail');
      return childEmail ? childEmail.trim() : null;
    }
  } catch (error) {
    console.error('❌ Error retrieving child email from localStorage:', error);
  }
  return null;
};

/**
 * Utility to append child_email query param to an endpoint when needed
 */
export const appendChildEmail = (url, childEmail) => {
  const email = (childEmail ?? getChildEmailForParent()) || null;
  if (!email) {
    return url;
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}child_email=${encodeURIComponent(email)}`;
};

/**
 * API Endpoints Configuration
 */
export const API_CONFIG = {
  // ============================================
  // DJANGO BACKEND - Database & Core Features
  // ============================================
  DJANGO: {
    BASE_URL: DJANGO_BASE_URL,
    
    // Authentication
    AUTH: {
      LOGIN: `${DJANGO_BASE_URL}/auth/login/`,
      REGISTER: `${DJANGO_BASE_URL}/auth/register/`,
      LOGOUT: `${DJANGO_BASE_URL}/auth/logout/`,
      REFRESH_TOKEN: `${DJANGO_BASE_URL}/auth/token/refresh/`,
      USER_PROFILE: `${DJANGO_BASE_URL}/auth/profile/`,
      PROFILE_UPDATE: `${DJANGO_BASE_URL}/auth/profile/update/`,
      CHILD_PROFILE: `${DJANGO_BASE_URL}/auth/child-profile/`,
      PARENT_PROFILE: `${DJANGO_BASE_URL}/auth/parent-profile/`,
      FEEDBACK_SUBMIT: `${DJANGO_BASE_URL}/auth/feedback/submit/`,
      FEEDBACK_STATUS: `${DJANGO_BASE_URL}/auth/feedback/status/`,
      
      // Coin/Rewards endpoints
      ADD_COINS: `${DJANGO_BASE_URL}/auth/coins/add/`,
      GET_COIN_BALANCE: `${DJANGO_BASE_URL}/auth/coins/balance/`,
      GET_COIN_TRANSACTIONS: `${DJANGO_BASE_URL}/auth/coins/transactions/`,
      CHECK_DAILY_LOGIN_REWARD: `${DJANGO_BASE_URL}/auth/coins/check-daily-login/`,
      CHECK_VIDEO_REWARD: `${DJANGO_BASE_URL}/auth/coins/check-video-reward/`,
      
      // Streaks endpoints
      STREAKS: {
        GET_STREAK: `${DJANGO_BASE_URL}/auth/streaks/`,
        UPDATE_STREAK: `${DJANGO_BASE_URL}/auth/streaks/update/`,
      },
      
      // Daily Summary endpoints
      DAILY_SUMMARY: `${DJANGO_BASE_URL}/auth/daily-summary/`,
    },
    
    // Courses
    COURSES: {
      LIST: `${DJANGO_BASE_URL}/courses/`,
      DETAIL: (id) => `${DJANGO_BASE_URL}/courses/${id}/`,
      ENROLL: (id) => `${DJANGO_BASE_URL}/courses/${id}/enroll/`,
      MY_COURSES: `${DJANGO_BASE_URL}/courses/my-courses/`,
    },
    
    // Quizzes (Database-based)
    QUIZZES: {
      LIST: `${DJANGO_BASE_URL}/quizzes/`,
      DETAIL: (id) => `${DJANGO_BASE_URL}/quizzes/${id}/`,
      START: (id) => `${DJANGO_BASE_URL}/quizzes/${id}/start/`,
      SUBMIT: (id) => `${DJANGO_BASE_URL}/quizzes/${id}/submit/`,
      MY_ATTEMPTS: `${DJANGO_BASE_URL}/quizzes/my-attempts/`,
      STATS: `${DJANGO_BASE_URL}/quizzes/stats/`,
      
      // NEW: Enhanced Quiz Tracking System
      SUBMIT_ATTEMPT: `${DJANGO_BASE_URL}/quizzes/submit-attempt/`,
      SUBMIT_MOCK_TEST: `${DJANGO_BASE_URL}/quizzes/submit-mock-test/`,
      RECENT_ATTEMPTS: `${DJANGO_BASE_URL}/quizzes/recent-attempts/`,
      CHILD_ATTEMPTS: `${DJANGO_BASE_URL}/quizzes/child-attempts/`,
      PERFORMANCE: `${DJANGO_BASE_URL}/quizzes/performance/`,
      STATISTICS: `${DJANGO_BASE_URL}/quizzes/statistics/`,
      
      // Static Quizzes
      STATIC_SUBJECTS: `${DJANGO_BASE_URL}/quizzes/static/subjects/`,
      STATIC_TOPICS: (subject) => `${DJANGO_BASE_URL}/quizzes/static/subjects/${subject}/topics/`,
      STATIC_QUIZ: (subject, topic) => `${DJANGO_BASE_URL}/quizzes/static/subjects/${subject}/topics/${topic}/`,
      
      // PDF Quizzes
      PDF_STRUCTURE: `${DJANGO_BASE_URL}/quizzes/pdf/structure/`,
      PDF_SUBJECTS: (className) => `${DJANGO_BASE_URL}/quizzes/pdf/${className}/subjects/`,
      PDF_TOPICS: (className, subject) => `${DJANGO_BASE_URL}/quizzes/pdf/${className}/${subject}/topics/`,
    },
    
    // Progress Tracking
    PROGRESS: {
      OVERVIEW: `${DJANGO_BASE_URL}/progress/`,
      BY_COURSE: (courseId) => `${DJANGO_BASE_URL}/progress/course/${courseId}/`,
      UPDATE: `${DJANGO_BASE_URL}/progress/update/`,
    },
    
    // Notifications
    NOTIFICATIONS: {
      LIST: `${DJANGO_BASE_URL}/notifications/`,
      MARK_READ: (id) => `${DJANGO_BASE_URL}/notifications/${id}/mark-read/`,
      MARK_ALL_READ: `${DJANGO_BASE_URL}/notifications/mark-all-read/`,
      
      // Student Notifications (Study Plan Notifications)
      SAVE_STUDENT_NOTIFICATION: `${DJANGO_BASE_URL}/notifications/student/save/`,
      GET_STUDENT_NOTIFICATIONS: `${DJANGO_BASE_URL}/notifications/student/list/`,
      MARK_STUDENT_NOTIFICATION_READ: (id) => `${DJANGO_BASE_URL}/notifications/student/${id}/mark-read/`,
      DELETE_STUDENT_NOTIFICATION: (id) => `${DJANGO_BASE_URL}/notifications/student/${id}/delete/`,
      CLEAR_ALL_STUDENT_NOTIFICATIONS: `${DJANGO_BASE_URL}/notifications/student/clear-all/`,
    },
    
    // AI Assistant - Database Operations
    AI_ASSISTANT: {
      // Save endpoints
      SAVE_STUDY_PLAN: `${DJANGO_BASE_URL}/ai-assistant/save-study-plan/`,
      SAVE_AI_NOTE: `${DJANGO_BASE_URL}/ai-assistant/save-ai-note/`,
      SAVE_MANUAL_NOTE: `${DJANGO_BASE_URL}/ai-assistant/save-manual-note/`,
      SAVE_CHAT_MESSAGE: `${DJANGO_BASE_URL}/ai-assistant/save-chat-message/`,
      
      // Get endpoints
      GET_STUDY_PLANS: `${DJANGO_BASE_URL}/ai-assistant/study-plans/`,
      GET_AI_NOTES: `${DJANGO_BASE_URL}/ai-assistant/ai-notes/`,
      GET_MANUAL_NOTES: `${DJANGO_BASE_URL}/ai-assistant/manual-notes/`,
      GET_CHAT_HISTORY: `${DJANGO_BASE_URL}/ai-assistant/chat-history/`,
      GET_ALL_NOTES: `${DJANGO_BASE_URL}/ai-assistant/all-notes/`,
      
      // Update/Delete endpoints
      UPDATE_MANUAL_NOTE: (noteId) => `${DJANGO_BASE_URL}/ai-assistant/manual-notes/${noteId}/`,
      DELETE_MANUAL_NOTE: (noteId) => `${DJANGO_BASE_URL}/ai-assistant/manual-notes/${noteId}/delete/`,
      
      // Favorites endpoints
      TOGGLE_FAVORITE: `${DJANGO_BASE_URL}/ai-assistant/toggle-favorite/`,
      GET_FAVORITES: `${DJANGO_BASE_URL}/ai-assistant/favorites/`,
      
      // Calendar endpoints
      SAVE_CALENDAR_ENTRY: `${DJANGO_BASE_URL}/ai-assistant/calendar/save/`,
      SAVE_CALENDAR_ENTRIES: `${DJANGO_BASE_URL}/ai-assistant/calendar/save-multiple/`,
      GET_CALENDAR_ENTRIES: `${DJANGO_BASE_URL}/ai-assistant/calendar/entries/`,
    },
    
    // Badges, Streaks, Daily Summary, and Leaderboard
    BADGES: {
      GET_BADGES: `${DJANGO_BASE_URL}/auth/badges/`,
      AWARD_BADGE: `${DJANGO_BASE_URL}/auth/badges/award/`,
    },
    STREAKS: {
      GET_STREAK: `${DJANGO_BASE_URL}/auth/streaks/`,
      UPDATE_STREAK: `${DJANGO_BASE_URL}/auth/streaks/update/`,
    },
    DAILY_SUMMARY: {
      GET_DAILY_SUMMARY: `${DJANGO_BASE_URL}/auth/daily-summary/`,
    },
    LEADERBOARD: {
      GET_LEADERBOARD: `${DJANGO_BASE_URL}/auth/leaderboard/`,
    },
  },
  
  // ============================================
  // FASTAPI BACKEND - AI Features
  // ============================================
  FASTAPI: {
    BASE_URL: FASTAPI_BASE_URL,
    
    // Quick Practice (AI-Generated Quizzes)
    QUICK_PRACTICE: {
      GET_CLASSES: `${FASTAPI_BASE_URL}/classes`,
      GET_CHAPTERS: (className) => `${FASTAPI_BASE_URL}/chapters?class_name=${className}`,
      GET_SUBTOPICS: (className, subject) => `${FASTAPI_BASE_URL}/subtopics?class_name=${className}&subject=${encodeURIComponent(subject)}`,
      GENERATE_QUIZ: (params) => {
        const queryParams = new URLSearchParams(params).toString();
        return `${FASTAPI_BASE_URL}/quiz?${queryParams}`;
      },
    },
    
    // Mock Tests (AI-Generated)
    MOCK_TEST: {
      GET_CLASSES: `${FASTAPI_BASE_URL}/mock_classes`,
      GET_SUBJECTS: (className) => `${FASTAPI_BASE_URL}/mock_subjects?class_name=${className}`,
      GET_CHAPTERS: (className, subject) => `${FASTAPI_BASE_URL}/mock_chapters?class_name=${className}&subject=${encodeURIComponent(subject)}`,
      GENERATE_TEST: (params) => {
        const queryParams = new URLSearchParams(params).toString();
        return `${FASTAPI_BASE_URL}/mock_test?${queryParams}`;
      },
    },
    
    // AI Assistant
    AI_ASSISTANT: {
      CHAT: `${FASTAPI_BASE_URL}/ai-assistant/chat`,
      GENERATE_STUDY_PLAN: `${FASTAPI_BASE_URL}/ai-assistant/generate-study-plan`,
      GENERATE_NOTES: `${FASTAPI_BASE_URL}/ai-assistant/generate-notes`,
      // Note: These endpoints need to be added to the FastAPI backend
      GENERATE_OVERVIEW: `${FASTAPI_BASE_URL}/ai-assistant/generate-notes`, // Using generate-notes as fallback
      GENERATE_EXPLANATIONS: `${FASTAPI_BASE_URL}/ai-assistant/chat`, // Using chat as fallback
    },
  },
};

/**
 * Helper function to get auth headers
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('userToken');
  
  // Check if token is valid (basic check - not expired format)
  if (token && token.includes('.')) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        clearAuthData();
        return { 'Content-Type': 'application/json' };
      }
    } catch (e) {
      clearAuthData();
      return { 'Content-Type': 'application/json' };
    }
  }
  
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  } : {
    'Content-Type': 'application/json',
  };
};

// Clear all authentication data
export const clearAuthData = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('firstName');
  localStorage.removeItem('studentData');
  localStorage.removeItem('parentData');
  localStorage.removeItem('studentDataLastFetch');
  localStorage.removeItem('parentDataLastFetch');
  localStorage.removeItem('rewardPoints');
  localStorage.removeItem('rewardsHistory');
};

/**
 * Helper function to get headers without auth (for registration)
 */
export const getNoAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

/**
 * Helper function for Django API calls
 */
export const djangoAPI = {
  get: async (url) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      // If 401 Unauthorized, clear authentication data
      if (response.status === 401) {
        clearAuthData();
      }
      
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  },
  
  post: async (url, data) => {
    const headers = getAuthHeaders();
    console.log(`📤 POST request to: ${url}`);
    console.log(`📋 Headers:`, { ...headers, Authorization: headers.Authorization ? headers.Authorization.substring(0, 20) + '...' : 'None' });
    console.log(`📋 Body:`, data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
    
    console.log(`📥 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error response:`, errorText);
      
      // If 401 Unauthorized, clear authentication data
      if (response.status === 401) {
        console.error('❌ 401 Unauthorized - Clearing auth data');
        clearAuthData();
      }
      
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log(`✅ Response data:`, responseData);
    return responseData;
  },
  
  // Special method for registration (no auth needed)
  postNoAuth: async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: getNoAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  },
  
  put: async (url, data) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  },
  
  delete: async (url) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
};

/**
 * Helper function for FastAPI calls (no auth needed)
 */
export const fastAPI = {
  get: async (url) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    // Try to parse JSON, but handle errors gracefully
    let data;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      } else {
        data = { error: `Server returned empty response (status: ${response.status})` };
      }
    } catch (parseError) {
      // If JSON parsing fails, create error object
      console.error("Failed to parse response JSON:", parseError);
      data = { 
        error: `Server error (status: ${response.status}). Failed to parse response.` 
      };
    }
    
    // Handle all error status codes gracefully - return the error data instead of throwing
    if (!response.ok) {
      // For 401, 402, 500, etc. - return the error data so frontend can display it
      return data; // Return error data so frontend can handle it
    }
    
    return data;
  },
  
  post: async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
};

/**
 * Quiz Tracking API Functions - Database operations for quiz/mock test results
 */
export const quizTrackingAPI = {
  // Submit quiz attempt to database
  submitAttempt: async (quizData) => {
    return await djangoAPI.post(API_CONFIG.DJANGO.QUIZZES.SUBMIT_ATTEMPT, quizData);
  },
  
  // Submit mock test attempt to database
  submitMockTest: async (mockTestData) => {
    return await djangoAPI.post(API_CONFIG.DJANGO.QUIZZES.SUBMIT_MOCK_TEST, mockTestData);
  },
  
  // Get recent quiz attempts for current user
  getRecentAttempts: async ({ limit = 10, childEmail } = {}) => {
    const params = new URLSearchParams();
    if (limit !== undefined && limit !== null) {
      params.append('limit', limit);
    }
    if (childEmail) {
      params.append('child_email', childEmail);
    }
    const query = params.toString();
    const url = query
      ? `${API_CONFIG.DJANGO.QUIZZES.RECENT_ATTEMPTS}?${query}`
      : API_CONFIG.DJANGO.QUIZZES.RECENT_ATTEMPTS;
    return await djangoAPI.get(url);
  },
  
  // Get student performance data from database
  getPerformance: async (childEmail) => {
    return await djangoAPI.get(appendChildEmail(API_CONFIG.DJANGO.QUIZZES.PERFORMANCE, childEmail));
  },
  
  // Get detailed quiz statistics from database
  getStatistics: async (childEmail) => {
    return await djangoAPI.get(appendChildEmail(API_CONFIG.DJANGO.QUIZZES.STATISTICS, childEmail));
  },
  
  // Get my quiz attempts (user-specific)
  getMyAttempts: async () => {
    return await djangoAPI.get(API_CONFIG.DJANGO.QUIZZES.MY_ATTEMPTS);
  },
};

export default API_CONFIG;

