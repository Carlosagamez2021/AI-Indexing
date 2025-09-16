/**
 * Configuration value structure.
 * @description Defines the structure for individual configuration values.
 */
interface ConfigValue {
  /** Configuration key name */
  key: string
  /** Configuration value */
  value: any
  /** Expected data type for the value */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  /** Optional description of the configuration */
  description?: string
  /** Whether this configuration is required */
  required?: boolean
}

/**
 * Configuration schema structure.
 * @description Defines the structure for configuration schemas.
 */
interface ConfigSchema {
  /** Mapping of configuration keys to their definitions */
  [key: string]: ConfigValue
}

/**
 * Configuration management system.
 * @description Handles application configuration with schema validation and defaults.
 */
class ConfigManager {
  /** Internal storage for configuration values */
  private config: Map<string, any> = new Map()
  /** Configuration schema definition */
  private schema: ConfigSchema = {}
  /** Default configuration values */
  private defaults: Map<string, any> = new Map()

  /**
   * Sets the configuration schema.
   * @description Defines the structure and validation rules for configuration.
   * @param schema - Configuration schema definition
   */
  setSchema(schema: ConfigSchema): void {
    this.schema = schema
    for (const [key, configValue] of Object.entries(schema)) {
      if ('default' in configValue) {
        this.defaults.set(key, configValue.default)
      }
    }
  }

  /**
   * Sets a configuration value.
   * @description Stores a configuration value with type validation.
   * @param key - Configuration key name
   * @param value - Value to store
   * @returns True if value was set successfully, false if validation failed
   */
  set(key: string, value: any): boolean {
    const schemaValue = this.schema[key]
    if (schemaValue) {
      if (schemaValue.type === 'string' && typeof value !== 'string') {
        return false
      }
      if (schemaValue.type === 'number' && typeof value !== 'number') {
        return false
      }
      if (schemaValue.type === 'boolean' && typeof value !== 'boolean') {
        return false
      }
      if (schemaValue.type === 'object' && typeof value !== 'object') {
        return false
      }
      if (schemaValue.type === 'array' && !Array.isArray(value)) {
        return false
      }
    }
    this.config.set(key, value)
    return true
  }

  /**
   * Gets a configuration value.
   * @description Retrieves a configuration value or default if not set.
   * @param key - Configuration key name
   * @returns Configuration value or default, undefined if not found
   */
  get<T = any>(key: string): T | undefined {
    return this.config.get(key) || this.defaults.get(key)
  }

  /**
   * Gets a required configuration value.
   * @description Retrieves a configuration value and throws if not found.
   * @param key - Configuration key name
   * @returns Configuration value
   * @throws Error if the configuration key is not found
   */
  getRequired<T = any>(key: string): T {
    const value = this.get<T>(key)
    if (value === undefined) {
      throw new Error(`Required configuration key '${key}' not found`)
    }
    return value
  }

  /**
   * Checks if a configuration key exists.
   * @description Determines if a key has a value or default.
   * @param key - Configuration key name
   * @returns True if key exists, false otherwise
   */
  has(key: string): boolean {
    return this.config.has(key) || this.defaults.has(key)
  }

  /**
   * Removes a configuration value.
   * @description Deletes a configuration value from storage.
   * @param key - Configuration key name
   * @returns True if value was removed, false if not found
   */
  delete(key: string): boolean {
    return this.config.delete(key)
  }

  /**
   * Gets all configuration values.
   * @description Returns all configuration values including defaults.
   * @returns Object containing all configuration values
   */
  getAll(): Record<string, any> {
    const result: Record<string, any> = {}
    for (const [key, value] of this.config) {
      result[key] = value
    }
    for (const [key, value] of this.defaults) {
      if (!this.config.has(key)) {
        result[key] = value
      }
    }
    return result
  }

  /**
   * Validates configuration against schema.
   * @description Checks if all required configurations are present.
   * @returns Array of validation error messages
   */
  validate(): string[] {
    const errors: string[] = []
    for (const [key, configValue] of Object.entries(this.schema)) {
      if (configValue.required && !this.has(key)) {
        errors.push(`Required configuration '${key}' is missing`)
      }
    }
    return errors
  }

  /**
   * Resets all configuration values.
   * @description Clears all stored configuration values.
   */
  reset(): void {
    this.config.clear()
  }
}

/**
 * Exports the ConfigManager, ConfigValue, and ConfigSchema types.
 * @description Exports the ConfigManager, ConfigValue, and ConfigSchema types.
 */
export { ConfigManager, type ConfigValue, type ConfigSchema }
