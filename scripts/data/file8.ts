/**
 * File upload configuration.
 * @description Defines the parameters for file upload operations.
 */
interface UploadConfig {
  /** Maximum file size in bytes */
  maxFileSize: number
  /** Allowed MIME types for uploads */
  allowedTypes: string[]
  /** Directory path for storing uploads */
  uploadPath: string
}

/**
 * File upload result structure.
 * @description Defines the structure for upload operation results.
 */
interface UploadResult {
  /** Name of the uploaded file */
  filename: string
  /** Full path where file was stored */
  path: string
  /** File size in bytes */
  size: number
  /** Whether the upload was successful */
  success: boolean
  /** Error message if upload failed */
  error?: string
}

/**
 * File upload management system.
 * @description Handles file uploads with validation and tracking.
 */
class FileUploader {
  /** Upload configuration parameters */
  private config: UploadConfig
  /** Internal storage for upload results */
  private uploads: Map<string, UploadResult> = new Map()

  /**
   * Creates a new file uploader instance.
   * @description Initializes the uploader with configuration parameters.
   * @param config - Upload configuration settings
   */
  constructor(config: UploadConfig) {
    this.config = config
  }

  /**
   * Uploads a file with validation.
   * @description Processes file upload with size and type validation.
   * @param file - File object to upload
   * @param customName - Optional custom filename
   * @returns Upload result with success status and metadata
   */
  async uploadFile(file: File, customName?: string): Promise<UploadResult> {
    if (file.size > this.config.maxFileSize) {
      return {
        filename: file.name,
        path: '',
        size: file.size,
        success: false,
        error: 'File too large'
      }
    }

    if (!this.config.allowedTypes.includes(file.type)) {
      return {
        filename: file.name,
        path: '',
        size: file.size,
        success: false,
        error: 'File type not allowed'
      }
    }
    const filename = customName || `${Date.now()}-${file.name}`
    const filepath = `${this.config.uploadPath}/${filename}`
    try {
      console.log(`Uploading file: ${filename}`)
      const result: UploadResult = {
        filename,
        path: filepath,
        size: file.size,
        success: true
      }
      this.uploads.set(filename, result)
      return result
    } catch (error) {
      return {
        filename: file.name,
        path: '',
        size: file.size,
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  /**
   * Gets upload result by filename.
   * @description Retrieves the result of a specific upload operation.
   * @param filename - Name of the uploaded file
   * @returns Upload result or undefined if not found
   */
  getUpload(filename: string): UploadResult | undefined {
    return this.uploads.get(filename)
  }

  /**
   * Gets all upload results.
   * @description Returns all stored upload results.
   * @returns Array of all upload results
   */
  getAllUploads(): UploadResult[] {
    return Array.from(this.uploads.values())
  }

  /**
   * Removes an upload result from storage.
   * @description Deletes the specified upload result.
   * @param filename - Name of the file to remove
   * @returns True if removed, false if not found
   */
  deleteUpload(filename: string): boolean {
    return this.uploads.delete(filename)
  }

  /**
   * Gets the total number of uploads.
   * @description Returns the count of stored upload results.
   * @returns Number of uploads
   */
  getUploadCount(): number {
    return this.uploads.size
  }
}

/**
 * Exports the FileUploader, UploadConfig, and UploadResult types.
 * @description Exports the FileUploader, UploadConfig, and UploadResult types.
 */
export { FileUploader, type UploadConfig, type UploadResult }
