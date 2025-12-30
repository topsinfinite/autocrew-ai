/**
 * Generic API Response Type
 * Used for all API responses to maintain consistency
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
  count?: number;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
}

/**
 * API Success Response
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  count?: number;
}
