
import { toast } from 'sonner';

export type ErrorLevel = 'error' | 'warning' | 'info';

interface ErrorHandlingOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
  level?: ErrorLevel;
}

/**
 * Centralized error handling service for consistent error management
 */
export const errorHandler = {
  /**
   * Handle an error with optional notification and logging
   */
  handle: (error: any, options: ErrorHandlingOptions = {}) => {
    const {
      showToast = true,
      logToConsole = true,
      customMessage,
      level = 'error'
    } = options;
    
    // Extract error message
    const errorMessage = customMessage || 
      (error?.message ? error.message : 'An unexpected error occurred');
    
    // Log to console if enabled
    if (logToConsole) {
      if (level === 'error') {
        console.error('[Error]:', error);
      } else if (level === 'warning') {
        console.warn('[Warning]:', error);
      } else {
        console.info('[Info]:', error);
      }
    }
    
    // Show toast notification if enabled
    if (showToast) {
      if (level === 'error') {
        toast.error(errorMessage);
      } else if (level === 'warning') {
        toast.warning(errorMessage);
      } else {
        toast.info(errorMessage);
      }
    }
    
    // Return the error message for further handling
    return errorMessage;
  }
};
