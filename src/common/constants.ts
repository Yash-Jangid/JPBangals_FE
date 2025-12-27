// API Configuration
// export const BASE_URL_MOBILE = 'http://10.16.106.243:8000/api/development';
export const BASE_URL = 'https://edurise.education/';
export const BASE_URL_ASSETS = 'http://172.28.155.243:8000';

// dev
// export const BASE_URL_MOBILE = 'http://192.168.191.1:8000';
// export const BASE_URL_ASSETS = 'http://192.168.191.1:8000';
export const API_KEY = '1234';

// App Configuration
export const APP_NAME = 'EduriseApp';
export const APP_VERSION = '2.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@edurise_auth_token',
  USER_DATA: '@edurise_user_data',
  SETTINGS: '@edurise_settings',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/mobile/auth/login',
  REGISTER: '/mobile/auth/register',
  LOGOUT: '/mobile/auth/logout',

  // Profile
  PROFILE: '/mobile/panel/setting',
  DASHBOARD_STATS: '/mobile/panel',

  // Meetings
  MEETINGS_LIST: '/mobile/panel/webinars/meetings',
  SCHEDULE_MEETING: '/mobile/meetings/reserve',
  INSTRUCTORS: '/mobile/instructors',

  // Courses
  PURCHASED_COURSES: '/mobile/panel/webinars/purchases',

  // Support
  SUPPORT_MESSAGES: '/mobile/panel/support',

  // Notifications
  NOTIFICATIONS: '/mobile/panel/notifications',

  // Comments
  COMMENTS: '/mobile/panel/webinars/my-comments',
} as const;

// Meeting Types
export const MEETING_TYPES = {
  ONLINE: 'online',
  IN_PERSON: 'in_person',
  ALL: 'all',
} as const;

// Meeting Status
export const MEETING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
} as const;

export const BASE_URL_MOBILE = 'https://linen-otter-330076.hostingersite.com/api/development';