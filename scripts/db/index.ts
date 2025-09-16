import knex, { Knex } from 'knex'
import { join } from 'path'

/**
 * Database configuration object.
 * @description Configuration for SQLite database connection.
 */
const config: Knex.Config = {
  client: 'better-sqlite3',
  connection: {
    filename: join(process.cwd(), 'scripts', 'db', 'indexing.sqlite')
  },
  pool: {
    min: 0,
    max: 1
  },
  useNullAsDefault: true
}

/**
 * Knex database instance.
 * @description Main database connection object for SQLite operations.
 */
const db: Knex = knex(config)

/**
 * Exports the database instance for use in other modules.
 * @description Provides access to the configured Knex database instance.
 */
export default db