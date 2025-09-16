import db from '@db/index'
import { initDatabase } from '@tool/Indexing'

/**
 * Semantic search utility for querying indexed data
 * Handles search operations with relevance scoring and result deduplication
 */
export class SemanticSearchTool {
  private toolName: string = 'semantic_search'

  /**
   * Searches indexed data by query terms
   * @description Performs semantic search across keywords and descriptions with relevance scoring
   * @param query - Search query string
   * @returns Array of matching records with relevance scores
   */
  async execute(query: string) {
    await initDatabase()
    if (!query) {
      return []
    }
    if (query.length === 0 || query.length > 100) {
      return []
    }
    console.log(`-- Start Searching --`)
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0)
    if (searchTerms.length === 0) {
      console.log(`-- No search terms found --`)
      return []
    }
    const searchResult = []
    for (const term of searchTerms) {
      const queryResult = await db('indexing')
        .where('keywords', 'like', `%${term}%`)
        .orWhere('description', 'like', `%${term}%`)
        .limit(3)
      searchResult.push(...queryResult)
    }
    console.log('-- Start Scoring --')
    let scoreResult: any[] = []
    for (const record of searchResult) {
      const relevanceScore = this.calculateRelevanceScore(record, searchTerms)
      console.log(`[LOG] Relevance: ${record.id} - ${relevanceScore}`)
      scoreResult.push({
        ...record,
        relevanceScore
      })
    }
    const sortedScoreResult = scoreResult.sort((a, b) => b.relevanceScore - a.relevanceScore)
    const uniqueResults = sortedScoreResult.filter((record, index, self) => 
      index === self.findIndex(r => r.id === record.id)
    )
    console.log(`-- Found final "${uniqueResults.length}" unique results --`)
    return uniqueResults
  }

  /**
   * Calculates relevance score for search results
   * @description Scores records based on keyword matches, description matches, and term frequency
   * @param record - Database record to score
   * @param searchTerms - Array of search terms
   * @returns Relevance score (higher is more relevant)
   */
  private calculateRelevanceScore(record: any, searchTerms: string[]): number {
    let score = 0
    const keywords = record.keywords?.toLowerCase() || ''
    const description = record.description?.toLowerCase() || ''
    searchTerms.forEach(term => {
      if (keywords.includes(term)) {
        score += 4
      }
      if (description.includes(term)) {
        score += 2
      }
      if (description.includes(term) && keywords.includes(term)) {
        score += 2
      }
    })
    return score
  }

  /**
   * Returns the tool schema definition for system integration
   * @description Provides tool schema for LLM integration and execution
   * @returns Tool schema object with search parameters and descriptions
   */
  getSchema() {
    return {
      type: 'function',
      function: {
        name: this.toolName,
        description: 'Search and explore codebase using semantic search with relevance scoring. Finds relevant files, functions, and code patterns based on natural language queries.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Natural language query to find relevant indexed files, exaple: how the implementation of calculator, database connection, etc'
            }
          },
          required: ['query']
        }
      }
    }
  }
}
