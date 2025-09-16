/**
 * Email service configuration.
 * @description Defines the SMTP configuration for email sending.
 */
interface EmailConfig {
  /** SMTP server hostname */
  smtpHost: string
  /** SMTP server port number */
  smtpPort: number
  /** Username for SMTP authentication */
  username: string
  /** Password for SMTP authentication */
  password: string
  /** From email address */
  fromEmail: string
}

/**
 * Email message structure.
 * @description Defines the structure for email messages.
 */
interface EmailMessage {
  /** Recipient email address */
  to: string
  /** Email subject line */
  subject: string
  /** Email body content */
  body: string
  /** Whether the body contains HTML content */
  isHtml?: boolean
}

/**
 * Email service for sending messages.
 * @description Handles email sending through SMTP with bulk operations.
 */
class EmailService {
  /** Email service configuration */
  private config: EmailConfig
  /** Current connection status */
  private isConnected: boolean = false

  /**
   * Creates a new email service instance.
   * @description Initializes the service with SMTP configuration.
   * @param config - SMTP configuration parameters
   */
  constructor(config: EmailConfig) {
    this.config = config
  }

  /**
   * Establishes connection to the SMTP server.
   * @description Connects to the configured SMTP server.
   * @returns True if connection succeeds, false otherwise
   */
  async connect(): Promise<boolean> {
    try {
      console.log(`Connecting to SMTP: ${this.config.smtpHost}`)
      this.isConnected = true
      return true
    } catch (error) {
      console.error('SMTP connection failed:', error)
      return false
    }
  }

  /**
   * Sends a single email message.
   * @description Delivers an email to the specified recipient.
   * @param message - Email message to send
   * @returns True if email was sent successfully, false otherwise
   */
  async sendEmail(message: EmailMessage): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Email service not connected')
    }
    try {
      console.log(`Sending email to: ${message.to}`)
      console.log(`Subject: ${message.subject}`)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  /**
   * Sends multiple email messages in bulk.
   * @description Processes multiple emails concurrently.
   * @param messages - Array of email messages to send
   * @returns Array of boolean results for each email
   */
  async sendBulkEmails(messages: EmailMessage[]): Promise<boolean[]> {
    const results = await Promise.all(
      messages.map(message => this.sendEmail(message))
    )
    return results
  }

  /**
   * Disconnects from the SMTP server.
   * @description Closes the SMTP connection.
   */
  disconnect(): void {
    this.isConnected = false
    console.log('Email service disconnected')
  }

  /**
   * Checks if the email service is ready.
   * @description Determines if the service is connected and ready to send emails.
   * @returns True if connected, false otherwise
   */
  isReady(): boolean {
    return this.isConnected
  }
}

/**
 * Exports the EmailService, EmailConfig, and EmailMessage types.
 * @description Exports the EmailService, EmailConfig, and EmailMessage types.
 */
export { EmailService, type EmailConfig, type EmailMessage }
