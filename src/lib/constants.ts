// Application-wide constants

// Pagination
export const MAX_JOBS_PER_PAGE = 10;
export const DEFAULT_PAGE_SIZE = 10;

// Search & Filter
export const MAX_SEARCH_RESULTS = 100;
export const MAX_FILTER_OPTIONS = 10;
export const MIN_SEARCH_TERM_LENGTH = 2;

// UI Elements
export const TOAST_DURATION = 5000; // milliseconds
export const DEBOUNCE_DELAY = 300; // milliseconds

// Image Generation
export const INSTAGRAM_IMAGE_WIDTH = 1080;
export const INSTAGRAM_IMAGE_HEIGHT = 1080;
export const QR_CODE_SIZE = 200;

// Job Alert
export const MAX_JOB_ALERTS_PER_USER = 10;
export const MAX_KEYWORDS_PER_ALERT = 10;

// Routes
export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  DASHBOARD: "/dashboard",
  JOBS: "/jobs",
  JOB_DETAILS: (id: string) => `/jobs/${id}`,
  PROFILE: "/profile",
  APPLICATIONS: "/profile/applications",
  JOB_ALERTS: "/profile/job-alerts",
  SAVED_JOBS: "/profile/saved-jobs",
  COMPANIES: "/companies",
  COMPANY_DETAILS: (id: string) => `/companies/${id}`,
  ADMIN: "/admin",
  ADMIN_JOBS: "/admin/jobs",
  ADMIN_JOB_POST: "/admin/jobs/post",
  ADMIN_COMPANIES: "/admin/companies",
  ONBOARDING: "/onboarding",
};

// API Routes
export const API_ROUTES = {
  JOBS: "/api/jobs",
  JOB: (id: string) => `/api/jobs/${id}`,
  COMPANIES: "/api/companies",
  COMPANY: (id: string) => `/api/companies/${id}`,
  SKILLS: "/api/skills",
  DOMAINS: "/api/domains",
  PROFILE: "/api/profile",
  APPLICATIONS: "/api/applications",
  JOB_ALERTS: "/api/job-alerts",
  ADMIN_JOBS: "/api/admin/jobs",
  ADMIN_COMPANIES: "/api/admin/companies",
};

// Domain Categories (for organizing industries)
export const DOMAIN_CATEGORIES = [
  { id: "tech", name: "Technology" },
  { id: "health", name: "Healthcare" },
  { id: "finance", name: "Finance" },
  { id: "education", name: "Education" },
  { id: "retail", name: "Retail" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "legal", name: "Legal" },
  { id: "creative", name: "Creative Arts" },
  { id: "science", name: "Science & Research" },
  { id: "hospitality", name: "Hospitality" },
  { id: "construction", name: "Construction" },
  { id: "transport", name: "Transportation & Logistics" },
  { id: "agriculture", name: "Agriculture" },
  { id: "nonprofit", name: "Non-profit & NGO" },
  { id: "government", name: "Government" },
];

// Skill Categories
export const SKILL_CATEGORIES = [
  { id: "technical", name: "Technical Skills" },
  { id: "soft", name: "Soft Skills" },
  { id: "language", name: "Language Skills" },
  { id: "business", name: "Business Skills" },
  { id: "creative", name: "Creative Skills" },
];

// Form validations
export const PASSWORD_MIN_LENGTH = 8;
export const MAX_DESCRIPTION_LENGTH = 5000;
export const MAX_UPLOAD_SIZE_MB = 10;

// Image generation templates for admin tool
export const IMAGE_TEMPLATES = [
  { id: "standard", name: "Standard" },
  { id: "technical", name: "Technical" },
  { id: "creative", name: "Creative" },
  { id: "executive", name: "Executive" },
  { id: "casual", name: "Casual" },
];
