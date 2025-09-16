import { Ollama } from 'ollama'
import { readdirSync, statSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import db from '@db/index'

/**
 * Ollama format configuration for structured responses
 * @description Defines the expected JSON structure for Ollama API responses
 */
const ollamaFormat = {
  type: 'object',
  properties: {
    content: { type: 'string', description: 'Full repo map with @@ file path, ⋮... descriptions, and │ symbol lines' },
    description: { type: 'string', description: 'One paragraph description of what the code does and its purpose' },
    keywords: { type: 'string', description: 'Minimal 3 word each separator, max 5 keyword (separator by comma)' }
  },
  required: ['content', 'description', 'keywords']
}

/**
 * Initializes the database schema
 * @description Initializes the database schema with the necessary tables
 * @returns Promise that resolves when initialization is complete
 */
export const initDatabase = async (): Promise<void> => {
  try {
    const exists = await db.schema.hasTable('indexing')
    if (!exists) {
      await db.schema.createTable('indexing', (table) => {
        table.string('id').primary()
        table.string('content').notNullable()
        table.string('description').notNullable()
        table.string('keywords').notNullable()
        table.timestamp('created_at').notNullable().defaultTo(db.fn.now())
        table.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
      })
      console.log('[LOG] Indexing table created')
    } else {
      console.log('[LOG] Indexing table already exists')
    }
    console.log('[LOG] Database schema initialized')
  } catch (error) {
    throw new Error(`Failed to initialize database: ${(error as Error).message}`)
  }
}

/**
 * Indexes the codebase using AI analysis
 * @description Processes files through AI model to extract structured metadata and stores in database
 * @returns Promise that resolves when indexing is complete
 */
export const indexingCodebase = async (): Promise<void> => {
  await initDatabase()
  const files = getAllFiles(join(process.cwd(), 'scripts', 'data'))
  for (const filePath of files) {
    const prompt = readFileSync(join(process.cwd(), 'prompt', 'system.md'), 'utf8')
    const content = readFileSync(filePath, 'utf8')
    console.log(`[LOG] Indexing file: ${filePath}`)
    const ollamaClient = new Ollama({
      host: 'https://ollama.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_API_KEY'
      }
    })
    const ollamaResponse = await ollamaClient.chat({
      model: 'deepseek-v3.1:671b',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `## Context\nSystem wants you to give repo map for this file,\nFile path: ${filePath}\n\n## File Content\n\`\`\`${content}\`\`\`` }
      ],
      format: ollamaFormat,
      think: false,
      stream: false
    })
    if (ollamaResponse.message?.content) {
      try {
        const ollamaContent = JSON.parse(ollamaResponse.message.content)
        const checkData = await db('indexing').where('id', filePath).first()
        const ollamaMetaData = {
          content: ollamaContent.content,
          description: ollamaContent.description,
          keywords: ollamaContent.keywords
        }
        if (checkData) {
          await db('indexing').where('id', filePath).update({ ...ollamaMetaData })
          console.log(`[LOG] Updated into database: "Description - ${ollamaMetaData.description}"`)
        } else {
          await db('indexing').insert({ id: filePath, ...ollamaMetaData })
          console.log(`[LOG] Inserted into database: "Description - ${ollamaMetaData.description}"`)
        }
      } catch (error) {
        console.log(`[LOG] Error parsing Ollama response: ${(error as Error).message}`)
        process.exit(1)
      }
    } else {
      console.log('[LOG] No response from Ollama')
      process.exit(1)
    }
  }
}

/**
 * Gets all files recursively from a directory.
 * @description Recursively scans a directory and returns all file paths.
 * @param path - The directory path to scan
 * @returns Array of file paths
 * @throws Error if path is invalid or directory cannot be read
 */
export const getAllFiles = (path: string): string[] => {
  if (!path || path.trim() === '') {
    throw new Error('Path is required and cannot be empty')
  }
  if (!existsSync(path)) {
    throw new Error(`Path ${path} does not exist`)
  }
  const files: string[] = []
  try {
    const items = readdirSync(path)
    for (const item of items) {
      const fullPath = join(path, item)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath))
      } else {
        files.push(fullPath)
      }
    }
  } catch (error) {
    throw new Error(`Error reading directory ${path}: ${(error as Error).message}`)
  }
  return files
}
