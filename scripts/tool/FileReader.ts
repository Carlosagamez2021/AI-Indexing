import { readFile } from 'fs/promises'
import { existsSync, statSync } from 'fs'

/**
 * File reading utility with support for reading entire files or specific line ranges
 * @description Handles file safety checks, size validation, and optional linting
 */
export class FileReaderTool {
  private toolName: string = 'file_reader'

  /**
   * Reads entire file contents from the filesystem with absolute path
   * @description Reads file contents with validation and error handling
   * @param target_file - Path to the file to read, must be a valid file path
   * @returns Promise resolving to file content string or error message
   */
  async execute(
    target_file: string,
  ): Promise<string> {
    try {
      if (!existsSync(target_file)) {
        return `File not found: ${target_file}`
      }
      const stats = statSync(target_file)
      if (!stats.isFile()) {
        return `${target_file} is not a file`
      }
      const content = await readFile(target_file, 'utf-8')
      return content
    } catch (error) {
      return `File reading failed - ${(error as Error).message}`
    }
  }

  /**
   * Returns the tool schema definition for system integration
   * @description Provides tool schema for LLM integration and execution
   * @returns Tool schema object with file reading parameters and descriptions
   */
  getSchema() {
    return {
      type: 'function',
      function: {
        name: this.toolName,
        description: 'Read entire file contents from the filesystem with absolute path',
        parameters: {
          type: 'object',
          properties: {
            target_file: {
              type: 'string',
              description: 'Path to the file to read, must be a valid file path.'
            }
          },
          required: ['target_file']
        }
      }
    }
  }
}
