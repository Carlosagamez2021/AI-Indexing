/**
 * Validation rule configuration.
 * @description Defines the structure for field validation rules.
 */
interface ValidationRule {
  /** Whether the field is required */
  required?: boolean
  /** Minimum length for string values */
  minLength?: number
  /** Maximum length for string values */
  maxLength?: number
  /** Regular expression pattern for validation */
  pattern?: RegExp
  /** Custom validation function */
  custom?: (value: any) => boolean | string
}

/**
 * Validation result structure.
 * @description Defines the structure for validation operation results.
 */
interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean
  /** Array of validation error messages */
  errors: string[]
  /** Name of the validated field */
  field: string
}

/**
 * Data validation system.
 * @description Handles validation of data against configurable rules.
 */
class Validator {
  /** Internal storage for validation rules */
  private rules: Map<string, ValidationRule[]> = new Map()

  /**
   * Adds a validation rule for a field.
   * @description Registers a new validation rule for the specified field.
   * @param field - Name of the field to validate
   * @param rule - Validation rule configuration
   */
  addRule(field: string, rule: ValidationRule): void {
    if (!this.rules.has(field)) {
      this.rules.set(field, [])
    }
    this.rules.get(field)!.push(rule)
  }

  /**
   * Validates all fields in the provided data.
   * @description Runs validation against all configured rules for each field.
   * @param data - Object containing field values to validate
   * @returns Array of validation results for each field
   */
  validate(data: Record<string, any>): ValidationResult[] {
    const results: ValidationResult[] = []
    for (const [field, value] of Object.entries(data)) {
      const fieldRules = this.rules.get(field) || []
      const errors: string[] = []
      for (const rule of fieldRules) {
        if (rule.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`)
          continue
        }
        if (value !== undefined && value !== null && value !== '') {
          if (rule.minLength && value.length < rule.minLength) {
            errors.push(`${field} must be at least ${rule.minLength} characters`)
          }
          if (rule.maxLength && value.length > rule.maxLength) {
            errors.push(`${field} must be no more than ${rule.maxLength} characters`)
          }
          if (rule.pattern && !rule.pattern.test(value)) {
            errors.push(`${field} format is invalid`)
          }
          if (rule.custom) {
            const customResult = rule.custom(value)
            if (customResult !== true) {
              errors.push(typeof customResult === 'string' ? customResult : `${field} is invalid`)
            }
          }
        }
      }
      results.push({
        isValid: errors.length === 0,
        errors,
        field
      })
    }
    return results
  }

  /**
   * Validates a single field value.
   * @description Runs validation against rules for a specific field.
   * @param field - Name of the field to validate
   * @param value - Value to validate
   * @returns Validation result for the field
   */
  validateField(field: string, value: any): ValidationResult {
    const fieldRules = this.rules.get(field) || []
    const errors: string[] = []
    for (const rule of fieldRules) {
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`)
        continue
      }
      if (value !== undefined && value !== null && value !== '') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${field} must be at least ${rule.minLength} characters`)
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${field} must be no more than ${rule.maxLength} characters`)
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${field} format is invalid`)
        }
        if (rule.custom) {
          const customResult = rule.custom(value)
          if (customResult !== true) {
            errors.push(typeof customResult === 'string' ? customResult : `${field} is invalid`)
          }
        }
      }
    }
    return {
      isValid: errors.length === 0,
      errors,
      field
    }
  }

  /**
   * Clears all validation rules.
   * @description Removes all configured validation rules.
   */
  clearRules(): void {
    this.rules.clear()
  }
}

/**
 * Exports the Validator, ValidationRule, and ValidationResult types.
 * @description Exports the Validator, ValidationRule, and ValidationResult types.
 */
export { Validator, type ValidationRule, type ValidationResult }
