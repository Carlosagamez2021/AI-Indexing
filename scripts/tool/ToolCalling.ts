import { Ollama } from 'ollama'
import { ToolExecutor, ToolSchema} from '@tool/Schema'

/**
 * Represents a message in a conversation with role and content
 * @description Defines the structure for messages in the Ollama chat conversation
 */
export interface OllamaMessage {
  /** The id of the message */
  id?: string
  /** The role of the message sender (user, assistant, system, or tool) */
  role: string | 'user' | 'assistant' | 'system' | 'tool'
  /** The text content of the message */
  content: string
  /** The name of the tool that was called */
  tool_name?: string
  /** The tool calls associated with the message */
  tool_calls?: Array<{
    /** The function definition for the tool call */
    function: {
      /** The name of the tool to call */
      name: string
      /** The arguments to pass to the tool */
      arguments: Record<string, unknown>
    }
  }>
}

/**
 * Executes tool calling workflow with Ollama integration
 * @description Manages conversation flow with AI model and tool execution
 * @returns Promise that resolves when tool calling workflow is complete
 */
export const toolCalling = async () => {
  console.log(`[LOG] Loaded "${ToolSchema.length}" tools successfully`)
  const ollamaQuery = 'Explain how file1.ts works in my codebase'
  const ollamaClient = new Ollama({
    host: 'https://ollama.com',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer YOUR_API_KEY'
    }
  })
  const messages: OllamaMessage[] = [
    { role: 'system', content: 'You are a helpful assistant that can use tools to help the user.' },
    { role: 'user', content: ollamaQuery }
  ]
  let runningChat = true
  console.log(`[LOG] Query: ${ollamaQuery}`)
  while (runningChat) {
    console.log('-'.repeat(5))
    const response = await ollamaClient.chat({
      model: 'deepseek-v3.1:671b',
      messages,
      tools: ToolSchema,
      think: false,
      stream: false
    })
    if (response.message?.content) {
      console.log(`[LOG] Assistant content: ${response.message.content}`)
    }
    if (response.message?.tool_calls) {
      messages.push({ role: 'assistant', content: response.message.content, tool_calls: response.message.tool_calls })
      console.log(`  -> Assistant tool calls: ${JSON.stringify(response.message.tool_calls)}`)
      for (const toolCall of response.message.tool_calls) {
        const toolExecutor = new ToolExecutor()
        const toolPayload: any = {
          name: toolCall.function.name,
          arguments: toolCall.function.arguments
        }
        const toolResponse = await toolExecutor.execute(toolPayload)
        console.log(`  -> Tool response: ${toolResponse.substring(0, 100)}...`)
        messages.push({ role: 'tool', content: toolResponse, tool_name: toolCall.function.name })
      }
    }
    if (!response.message?.tool_calls) {
      runningChat = false
    }
  }
}