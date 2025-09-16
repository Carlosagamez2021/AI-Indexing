import { initDatabase, indexingCodebase } from '@tool/Indexing'
import { toolCalling } from '@tool/ToolCalling'

/**
 * Available commands
 * @description Available commands
 * @returns void
 */
const availableCommands = [
  { id: 'init', description: 'Initialize the database' },
  { id: 'indexing', description: 'Do indexing codebase' },
  { id: 'tool-calling', description: 'Do tool calling process' },
  { id: 'help', description: 'Show help' }
]

/**
 * Shows the help for the available commands
 * @description Shows the help for the available commands
 * @returns void
 */
const commandHelp = () => {
  console.log('Usage: npx tsx ./scripts/index.ts <command>')
  console.log('Commands :')
  availableCommands.forEach((command) => {
    console.log(`  ${command.id} - ${command.description}`)
  })
  process.exit(1)
}

/**
 * Parses the command and executes the appropriate function
 * @description Parses the command and executes the appropriate function
 * @returns void
 */
const commandParsing = async () => {
  const args = process.argv.slice(2)
  if (args.length === 0) {  
    return commandHelp()
  }
  const command = args[0]
  if (!availableCommands.some((c) => c.id === command)) {
    return commandHelp()
  }
  switch (command) {
    case 'init':
      await initDatabase()
      console.log('Database initialized')
      process.exit(0)
    case 'indexing':
      await indexingCodebase()
      console.log('Indexing codebase completed')
      process.exit(0)
    case 'tool-calling':
      await toolCalling()
      console.log('Tool calling completed')
      process.exit(0)
    case 'help':
      return commandHelp()
    default:
      return commandHelp()
  }
}
commandParsing()