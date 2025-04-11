// Types derived from Prisma schema
export type User = {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImage?: string | null;
  resume?: string | null;
  createdAt: Date;
  updatedAt: Date;
  skills?: UserSkill[];
  applications?: Application[];
  jobAlerts?: JobAlert[];
  preferences?: UserPreference | null;
};

export type UserPreference = {
  id: string;
  userId: string;
  preferredDomains: string[];
  preferredLocations: string[];
  minSalary?: number | null;
  maxSalary?: number | null;
  jobTypes: string[];
  remotePreference?: string | null;
  experienceLevel?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

export type Company = {
  id: string;
  name: string;
  logo?: string | null;
  website?: string | null;
  description?: string | null;
  industry: string[];
  size?: string | null;
  location?: string | null;
  createdAt: Date;
  updatedAt: Date;
  jobs?: Job[];
};

export type Domain = {
  id: string;
  name: string;
  description?: string | null;
  subdomains?: Subdomain[];
  jobs?: Job[];
  createdAt: Date;
  updatedAt: Date;
};

export type Subdomain = {
  id: string;
  name: string;
  description?: string | null;
  domainId: string;
  domain: Domain;
  jobs?: Job[];
  createdAt: Date;
  updatedAt: Date;
};

export type Skill = {
  id: string;
  name: string;
  category?: string | null;
  jobs?: JobSkill[];
  users?: UserSkill[];
  createdAt: Date;
  updatedAt: Date;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  preferredSkills?: string | null;
  companyId: string;
  company: Company;
  location?: string | null;
  locationType: string;
  salary?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  salaryPeriod: string;
  jobType: string;
  experienceLevel: string;
  applicationLink: string;
  applicationDeadline?: Date | null;
  postedDate: Date;
  domains: Domain[];
  subdomains: Subdomain[];
  skills: JobSkill[];
  applications: Application[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  clickCount: number;
  imageUrl?: string | null;
  qrCodeUrl?: string | null;
};

export type JobSkill = {
  id: string;
  jobId: string;
  job: Job;
  skillId: string;
  skill: Skill;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSkill = {
  id: string;
  userId: string;
  user: User;
  skillId: string;
  skill: Skill;
  proficiency?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Application = {
  id: string;
  userId: string;
  user: User;
  jobId: string;
  job: Job;
  status: string;
  notes?: string | null;
  clickedAt: Date;
  statusUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type JobAlert = {
  id: string;
  userId: string;
  user: User;
  name: string;
  keywords: string[];
  domains: string[];
  locations: string[];
  jobTypes: string[];
  minSalary?: number | null;
  maxSalary?: number | null;
  experienceLevel?: string | null;
  remoteOnly: boolean;
  frequency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// UI Component Props Types
export type JobCardProps = {
  job: Job;
  onApply?: (jobId: string) => void;
  isSaved?: boolean;
  onSave?: (jobId: string) => void;
  onUnsave?: (jobId: string) => void;
};

export type JobFilterProps = {
  domains: Domain[];
  skills: Skill[];
  onFilterChange: (filters: JobFilterValues) => void;
  initialValues?: JobFilterValues;
};

export type JobFilterValues = {
  domains?: string[];
  skills?: string[];
  jobTypes?: string[];
  locations?: string[];
  experienceLevel?: string[];
  remoteType?: string[];
  salaryMin?: number;
  salaryMax?: number;
  postedWithin?: number;
};

// Enum-like constants
export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;
export const EXPERIENCE_LEVELS = [
  "Entry",
  "Mid",
  "Senior",
  "Lead",
  "Executive",
] as const;
export const LOCATION_TYPES = ["Remote", "Hybrid", "On-site"] as const;
export const APPLICATION_STATUS = [
  "CLICKED",
  "APPLIED",
  "INTERVIEWING",
  "OFFERED",
  "REJECTED",
] as const;
export const ALERT_FREQUENCY = ["DAILY", "WEEKLY", "IMMEDIATE"] as const;
export const SALARY_PERIOD = ["YEARLY", "MONTHLY", "HOURLY"] as const;
export const SKILL_PROFICIENCY = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;
export const COMPANY_SIZE = ["Small", "Medium", "Large", "Enterprise"] as const;
