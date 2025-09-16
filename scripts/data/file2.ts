/**
 * User account data structure.
 * @description Defines the structure for user account information with hashed password.
 */
interface UserAccount {
  /** Unique identifier for the account */
  id: number
  /** Username for the account */
  username: string
  /** Email address for the account */
  email: string
  /** Hashed password for security */
  hashedPassword: string
  /** Timestamp when the account was registered */
  registeredAt: Date
}

/**
 * Sign-in credentials structure.
 * @description Defines the required data for user authentication.
 */
interface SignInData {
  /** Email address for sign-in */
  email: string
  /** Password for sign-in */
  password: string
}

/**
 * User management system for account operations.
 * @description Handles user account creation, authentication, and session management.
 */
class UserManager {
  /** Internal storage for user accounts */
  private accounts: UserAccount[] = []
  /** Currently active user account */
  private activeUser: UserAccount | null = null

  /**
   * Signs in a user with provided credentials.
   * @description Validates user credentials and sets the active user if successful.
   * @param credentials - Sign-in credentials containing email and password
   * @returns User account object if sign-in succeeds, null otherwise
   */
  async signIn(credentials: SignInData): Promise<UserAccount | null> {
    const account = this.accounts.find(a => 
      a.email === credentials.email && 
      a.hashedPassword === credentials.password
    )
    if (account) {
      this.activeUser = account
      return account
    }
    return null
  }

  /**
   * Creates a new user account.
   * @description Registers a new account with generated ID and timestamp.
   * @param accountData - Account data excluding auto-generated fields
   * @returns The newly created account object
   */
  async createAccount(accountData: Omit<UserAccount, 'id' | 'registeredAt'>): Promise<UserAccount> {
    const newAccount: UserAccount = {
      ...accountData,
      id: Date.now(),
      registeredAt: new Date()
    }
    this.accounts.push(newAccount)
    return newAccount
  }

  /**
   * Signs out the active user.
   * @description Clears the active user session.
   */
  signOut(): void {
    this.activeUser = null
  }

  /**
   * Gets the currently active user account.
   * @description Returns the active user or null if no user is signed in.
   * @returns Active user account object or null
   */
  getActiveUser(): UserAccount | null {
    return this.activeUser
  }

  /**
   * Checks if a user is currently signed in.
   * @description Determines if there is an active user session.
   * @returns True if user is signed in, false otherwise
   */
  isLoggedIn(): boolean {
    return this.activeUser !== null
  }
}

/**
 * Exports the UserManager, UserAccount, and SignInData types.
 * @description Exports the UserManager, UserAccount, and SignInData types.
 */
export { UserManager, type UserAccount, type SignInData }
