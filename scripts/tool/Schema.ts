import { FileReaderTool } from '@tool/FileReader'
import { SemanticSearchTool } from '@tool/Semantic'

/**
 * Central registry containing all available tool schemas
 * @description Provides tool definitions for Ollama integration and execution
 */
export const ToolSchema: any[] = [
  new FileReaderTool().getSchema(),
  new SemanticSearchTool().getSchema()
]

/**
 * Tool executor for handling tool operations
 * @description Manages execution of various tools based on provided payload data
 */
export class ToolExecutor {
  private fileReaderTool = new FileReaderTool()
  private semanticSearchTool = new SemanticSearchTool()

  /**
   * Executes tool operations based on provided payload data
   * @description Routes tool calls to appropriate tool implementations and returns results
   * @param payload - Tool execution request containing name, arguments, and metadata
   * @returns Promise resolving to tool execution result with status and output
   */
  async execute(payload: any): Promise<string> {
    try {
      switch (payload.name) {
        case 'file_reader': {
          const { target_file } = payload.arguments
          const result = await this.fileReaderTool.execute(
            target_file as string
          )
          return result
        }
        case 'semantic_search': {
          const { query } = payload.arguments
          const result = await this.semanticSearchTool.execute(
            query as string
          )
          return result.map((item) => item.content).join('\n')
        }
        default: {
          return `tool_not_found: Tool '${payload.name}' not found`
        }
      }
    } catch (error) {
      return `tool_error: ${(error as Error).message}`
    }
  }
}
