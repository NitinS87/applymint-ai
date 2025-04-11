import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

/**
 * Combines class names using clsx and tailwind-merge for optimal class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats currency values to a readable string
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency = "USD",
  minimumFractionDigits = 0,
) {
  if (amount === null || amount === undefined) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM dd, yyyy");
}

/**
 * Formats a date to a relative time string (e.g., "2 days ago")
 */
export function formatRelativeDate(date: Date | string | null | undefined) {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generates a slug from a string
 */
export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Safely parses JSON
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return fallback;
  }
}

/**
 * Gets a random item from an array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Formats salary range as a readable string
 */
export function formatSalaryRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency = "USD",
  period = "YEARLY",
) {
  if (!min && !max) return "Salary not specified";

  const periodLabel =
    {
      YEARLY: "/year",
      MONTHLY: "/month",
      HOURLY: "/hour",
    }[period] || "";

  if (min && max) {
    return `${formatCurrency(min, currency, 0)} - ${formatCurrency(max, currency, 0)}${periodLabel}`;
  }

  if (min) {
    return `From ${formatCurrency(min, currency, 0)}${periodLabel}`;
  }

  if (max) {
    return `Up to ${formatCurrency(max, currency, 0)}${periodLabel}`;
  }

  return "Salary not specified";
}

/**
 * Formats job types for display
 */
export function formatJobType(jobType: string) {
  const typeMapping: Record<string, string> = {
    "Full-time": "Full-time",
    "Part-time": "Part-time",
    Contract: "Contract",
    Internship: "Internship",
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
  };

  return typeMapping[jobType] || jobType;
}

/**
 * Format experience level for display
 */
export function formatExperienceLevel(level: string) {
  const levelMapping: Record<string, string> = {
    Entry: "Entry Level",
    Mid: "Mid Level",
    Senior: "Senior Level",
    Lead: "Lead Level",
    Executive: "Executive Level",
    ENTRY: "Entry Level",
    MID: "Mid Level",
    SENIOR: "Senior Level",
    LEAD: "Lead Level",
    EXECUTIVE: "Executive Level",
  };

  return levelMapping[level] || level;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
