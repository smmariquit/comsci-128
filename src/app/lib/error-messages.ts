/**
 * Error message templates following Nielsen Heuristic #5:
 * Error Recovery - Plain Language, Suggest Solutions
 */

export const ErrorMessages: Record<string, string> = {
  // Network errors
  NETWORK_ERROR: "Unable to connect to the server. Please check your internet connection and try again.",
  TIMEOUT: "Request took too long. Please try again.",
  
  // Auth errors
  INVALID_CREDENTIALS: "Email or password is incorrect. Please try again.",
  USER_NOT_FOUND: "User account not found. Please sign up or check your email.",
  ACCOUNT_DISABLED: "This account has been disabled. Please contact support.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  
  // Validation errors
  REQUIRED_FIELD: (field: string) => `${field} is required.`,
  INVALID_EMAIL: "Please enter a valid email address (e.g., user@example.com).",
  WEAK_PASSWORD: "Password must be at least 8 characters with uppercase, lowercase, and numbers.",
  
  // Database errors
  DUPLICATE_EMAIL: "This email is already registered. Please log in or use a different email.",
  NOT_FOUND: "The requested item could not be found.",
  UNAUTHORIZED: "You don't have permission to perform this action.",
  
  // File upload errors
  FILE_TOO_LARGE: "File is too large. Maximum size is 5MB.",
  INVALID_FILE_TYPE: "File type not supported. Please use PNG, JPG, or PDF.",
  
  // Generic fallback
  GENERIC: "Something went wrong. Please try again or contact support if the problem persists.",
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check if error message matches known patterns
    const message = error.message.toLowerCase();
    
    if (message.includes("network")) return ErrorMessages.NETWORK_ERROR;
    if (message.includes("timeout")) return ErrorMessages.TIMEOUT;
    if (message.includes("invalid")) return ErrorMessages.INVALID_CREDENTIALS;
    if (message.includes("not found")) return ErrorMessages.NOT_FOUND;
    if (message.includes("unauthorized") || message.includes("permission")) return ErrorMessages.UNAUTHORIZED;
    
    // Return the actual error message if it's user-friendly
    return error.message;
  }
  
  return ErrorMessages.GENERIC;
}
