/**
 * User data structure.
 * @description Defines the structure for user account information.
 */
interface User {
  /** Unique identifier for the user */
  id: number
  /** Display name of the user */
  name: string
  /** Email address for authentication */
  email: string
  /** Password for authentication */
  password: string
  /** Timestamp when the user was created */
  createdAt: Date
}

/**
 * Login credentials structure.
 * @description Defines the required data for user authentication.
 */
interface LoginCredentials {
  /** Email address for login */
  email: string
  /** Password for login */
  password: string
}

/**
 * Authentication service for user management.
 * @description Handles user registration, login, and session management.
 */
class AuthService {
  /** Internal storage for registered users */
  private users: User[] = []
  /** Currently authenticated user */
  private currentUser: User | null = null

  /**
   * Authenticates a user with provided credentials.
   * @description Validates user credentials and sets the current user if successful.
   * @param credentials - Login credentials containing email and password
   * @returns User object if authentication succeeds, null otherwise
   */
  async login(credentials: LoginCredentials): Promise<User | null> {
    const user = this.users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    )
    if (user) {
      this.currentUser = user
      return user
    }
    return null
  }

  /**
   * Registers a new user account.
   * @description Creates a new user with generated ID and timestamp.
   * @param userData - User data excluding auto-generated fields
   * @returns The newly created user object
   */
  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: Date.now(),
      createdAt: new Date()
    }
    this.users.push(newUser)
    return newUser
  }

  /**
   * Logs out the current user.
   * @description Clears the current user session.
   */
  logout(): void {
    this.currentUser = null
  }

  /**
   * Gets the currently authenticated user.
   * @description Returns the current user or null if no user is logged in.
   * @returns Current user object or null
   */
  getCurrentUser(): User | null {
    return this.currentUser
  }

  /**
   * Checks if a user is currently authenticated.
   * @description Determines if there is an active user session.
   * @returns True if user is authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null
  }
}

/**
 * Exports the AuthService, User, and LoginCredentials types.
 * @description Exports the AuthService, User, and LoginCredentials types.
 */
export { AuthService, type User, type LoginCredentials }
