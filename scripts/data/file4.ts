/**
 * HTTP request configuration options.
 * @description Defines the parameters for making HTTP requests.
 */
interface RequestOptions {
  /** HTTP method to use for the request */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** Optional headers to include in the request */
  headers?: Record<string, string>
  /** Optional request body data */
  body?: any
  /** Optional timeout duration in milliseconds */
  timeout?: number
}

/**
 * API response structure.
 * @description Defines the structure for HTTP API responses.
 */
interface ApiResponse<T = any> {
  /** Response data payload */
  data: T
  /** HTTP status code */
  status: number
  /** Whether the request was successful */
  success: boolean
  /** Optional response message */
  message?: string
}

/**
 * HTTP client for making API requests.
 * @description Handles HTTP requests with configurable base URL and headers.
 */
class HttpClient {
  /** Base URL for all requests */
  private baseUrl: string
  /** Default headers applied to all requests */
  private defaultHeaders: Record<string, string>

  /**
   * Creates a new HTTP client instance.
   * @description Initializes the client with base URL and default headers.
   * @param baseUrl - Base URL for all requests
   * @param defaultHeaders - Default headers to include in requests
   */
  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    }
  }

  /**
   * Makes an HTTP request to the specified endpoint.
   * @description Executes the request with the provided options and returns the response.
   * @param endpoint - API endpoint to request
   * @param options - Request configuration options
   * @returns Promise resolving to API response
   */
  async request<T>(endpoint: string, options: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        method: options.method,
        headers: { ...this.defaultHeaders, ...options.headers },
        body: options.body ? JSON.stringify(options.body) : null
      })
      const data = await response.json()
      return {
        data,
        status: response.status,
        success: response.ok,
        message: response.ok ? 'Success' : 'Request failed'
      }
    } catch (error) {
      return {
        data: null as T,
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Makes a GET request to the specified endpoint.
   * @description Sends a GET request and returns the response.
   * @param endpoint - API endpoint to request
   * @returns Promise resolving to API response
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  /**
   * Makes a POST request to the specified endpoint.
   * @description Sends a POST request with body data and returns the response.
   * @param endpoint - API endpoint to request
   * @param body - Request body data
   * @returns Promise resolving to API response
   */
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body })
  }
}

/**
 * Export the HttpClient, RequestOptions, and ApiResponse types.
 * @description Exports the HttpClient, RequestOptions, and ApiResponse types.
 */
export { HttpClient, type RequestOptions, type ApiResponse }
