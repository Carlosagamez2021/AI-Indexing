## Context
System wants you to give repo map for this file,
File path: /Volumes/Indexing/Calculator.ts

### Full Content
```ts
import { EventEmitter } from 'events'

/**
 * Calculator class for performing basic arithmetic operations with history tracking.
 * @description A comprehensive calculator that supports addition, subtraction, multiplication, 
 * division, and maintains a history of all calculations. Includes error handling for 
 * division by zero and invalid operations.
 */
export class Calculator extends EventEmitter {
  /** 
   * Array to store calculation history
   * @private
   * @type {Array<{operation: string, operands: number[], result: number, timestamp: Date}>}
   */
  private history: Array<{
    operation: string
    operands: number[]
    result: number
    timestamp: Date
  }> = []

  /**
   * Maximum number of calculations to keep in history
   * @private
   * @readonly
   * @default 100
   */
  private readonly maxHistorySize: number = 100

  /**
   * Current calculation result
   * @private
   * @type {number}
   * @default 0
   */
  private currentResult: number = 0

  /**
   * Creates a new Calculator instance
   * @constructor
   * @param {number} [maxHistory=100] - Maximum number of calculations to store in history
   * @example
   * ```typescript
   * const calc = new Calculator(50)
   * const calc2 = new Calculator() // Uses default 100
   * ```
   */
  constructor(maxHistory: number = 100) {
    super()
    this.maxHistorySize = maxHistory
    this.emit('initialized', { maxHistory })
  }

  /**
   * Adds two numbers and stores the result in history
   * @param {number} a - First number to add
   * @param {number} b - Second number to add
   * @returns {number} The sum of a and b
   * @throws {Error} When operands are not valid numbers
   * @example
   * ```typescript
   * const result = calc.add(5, 3) // Returns 8
   * ```
   */
  add(a: number, b: number): number {
    this.validateOperands(a, b)
    const result = a + b
    this.addToHistory('add', [a, b], result)
    this.currentResult = result
    this.emit('calculation', { operation: 'add', operands: [a, b], result })
    return result
  }

  /**
   * Subtracts the second number from the first number
   * @param {number} a - Number to subtract from
   * @param {number} b - Number to subtract
   * @returns {number} The difference of a and b
   * @throws {Error} When operands are not valid numbers
   * @example
   * ```typescript
   * const result = calc.subtract(10, 3) // Returns 7
   * ```
   */
  subtract(a: number, b: number): number {
    this.validateOperands(a, b)
    const result = a - b
    this.addToHistory('subtract', [a, b], result)
    this.currentResult = result
    this.emit('calculation', { operation: 'subtract', operands: [a, b], result })
    return result
  }

  /**
   * Multiplies two numbers
   * @param {number} a - First number to multiply
   * @param {number} b - Second number to multiply
   * @returns {number} The product of a and b
   * @throws {Error} When operands are not valid numbers
   * @example
   * ```typescript
   * const result = calc.multiply(4, 5) // Returns 20
   * ```
   */
  multiply(a: number, b: number): number {
    this.validateOperands(a, b)
    const result = a * b
    this.addToHistory('multiply', [a, b], result)
    this.currentResult = result
    this.emit('calculation', { operation: 'multiply', operands: [a, b], result })
    return result
  }

  /**
   * Divides the first number by the second number
   * @param {number} a - Dividend (number to divide)
   * @param {number} b - Divisor (number to divide by)
   * @returns {number} The quotient of a and b
   * @throws {Error} When divisor is zero or operands are not valid numbers
   * @example
   * ```typescript
   * const result = calc.divide(15, 3) // Returns 5
   * const result2 = calc.divide(10, 0) // Throws Error: Division by zero
   * ```
   */
  divide(a: number, b: number): number {
    this.validateOperands(a, b)
    if (b === 0) {
      const error = new Error('Division by zero is not allowed')
      this.emit('error', { operation: 'divide', operands: [a, b], error: error.message })
      throw error
    }
    const result = a / b
    this.addToHistory('divide', [a, b], result)
    this.currentResult = result
    this.emit('calculation', { operation: 'divide', operands: [a, b], result })
    return result
  }

  /**
   * Calculates the power of a number
   * @param {number} base - The base number
   * @param {number} exponent - The exponent
   * @returns {number} The result of base raised to the power of exponent
   * @throws {Error} When operands are not valid numbers
   * @example
   * ```typescript
   * const result = calc.power(2, 3) // Returns 8
   * ```
   */
  power(base: number, exponent: number): number {
    this.validateOperands(base, exponent)
    const result = Math.pow(base, exponent)
    this.addToHistory('power', [base, exponent], result)
    this.currentResult = result
    this.emit('calculation', { operation: 'power', operands: [base, exponent], result })
    return result
  }

  /**
   * Calculates the square root of a number
   * @param {number} value - The number to calculate square root of
   * @returns {number} The square root of the value
   * @throws {Error} When value is negative or not a valid number
   * @example
   * ```typescript
   * const result = calc.sqrt(16) // Returns 4
   * ```
   */
  sqrt(value: number): number {
    this.validateOperands(value)
    if (value < 0) {
      const error = new Error('Cannot calculate square root of negative number')
      this.emit('error', { operation: 'sqrt', operands: [value], error: error.message })
      throw error
    }
    const result = Math.sqrt(value)
    this.addToHistory('sqrt', [value], result)
    this.currentResult = result
    this.emit('calculation', { operation: 'sqrt', operands: [value], result })
    return result
  }

  /**
   * Gets the current calculation result
   * @returns {number} The current result
   * @example
   * ```typescript
   * calc.add(5, 3)
   * const current = calc.getCurrentResult() // Returns 8
   * ```
   */
  getCurrentResult(): number {
    return this.currentResult
  }

  /**
   * Gets the calculation history
   * @returns {Array} A copy of the calculation history
   * @example
   * ```typescript
   * const history = calc.getHistory()
   * console.log(history.length) // Number of calculations performed
   * ```
   */
  getHistory(): Array<{
    operation: string
    operands: number[]
    result: number
    timestamp: Date
  }> {
    return [...this.history]
  }

  /**
   * Clears all calculation history
   * @emits clearHistory
   * @example
   * ```typescript
   * calc.clearHistory()
   * console.log(calc.getHistory().length) // Returns 0
   * ```
   */
  clearHistory(): void {
    const previousCount = this.history.length
    this.history = []
    this.currentResult = 0
    this.emit('clearHistory', { previousCount })
  }

  /**
   * Gets the number of calculations in history
   * @returns {number} The number of calculations stored
   * @example
   * ```typescript
   * const count = calc.getHistoryCount() // Returns number of calculations
   * ```
   */
  getHistoryCount(): number {
    return this.history.length
  }

  /**
   * Validates that operands are valid numbers
   * @private
   * @param {...number} operands - The operands to validate
   * @throws {Error} When any operand is not a valid number
   */
  private validateOperands(...operands: number[]): void {
    for (const operand of operands) {
      if (typeof operand !== 'number' || isNaN(operand) || !isFinite(operand)) {
        throw new Error(`Invalid operand: ${operand}. Must be a valid number.`)
      }
    }
  }

  /**
   * Adds a calculation to the history
   * @private
   * @param {string} operation - The operation performed
   * @param {number[]} operands - The operands used
   * @param {number} result - The result of the calculation
   */
  private addToHistory(operation: string, operands: number[], result: number): void {
    this.history.push({
      operation,
      operands,
      result,
      timestamp: new Date()
    })
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    }
  }

  /**
   * Resets the calculator to initial state
   * @emits reset
   * @example
   * ```typescript
   * calc.reset()
   * console.log(calc.getCurrentResult()) // Returns 0
   * ```
   */
  reset(): void {
    this.currentResult = 0
    this.emit('reset')
  }

  /**
   * Gets a summary of calculator statistics
   * @returns {Object} Summary object with statistics
   * @example
   * ```typescript
   * const stats = calc.getStats()
   * console.log(stats.totalCalculations) // Total number of calculations
   * ```
   */
  getStats(): {
    totalCalculations: number
    operationsCount: Record<string, number>
    lastCalculation?: Date
    currentResult: number
  } {
    const operationsCount: Record<string, number> = {}
    for (const entry of this.history) {
      operationsCount[entry.operation] = (operationsCount[entry.operation] || 0) + 1
    }
    return {
      totalCalculations: this.history.length,
      operationsCount,
      lastCalculation: this.history.length > 0 ? this.history[this.history.length - 1].timestamp : undefined,
      currentResult: this.currentResult
    }
  }
}
```
