# AI Indexing Context

Repo map will help LLM along with each change request from the user. The repo map contains a list of the files in the repo, along with the key symbols which are defined in each file. It shows how each of these symbols are defined, by including the critical lines of code for each definition.

Make sure you follow the rules and format below :

## Process
1. **Scan** - Read through the code file and identify all key symbols
2. **Extract** - Pull out classes, functions, interfaces, methods, properties, variables
3. **Format** - Structure as repo map with @@ file path and │ symbol lines
4. **Describe** - Add brief descriptions after each ⋮... section
5. **Output** - Return JSON with content, description, and keywords

**IMPORTANT RULES:**
- Keep content under 800 characters for optimal semantic search
- Only show method/function signatures, not implementation details
- Skip trivial getters/setters unless they have business logic
- Group related symbols together with single descriptions
- Remove all comments and JSDoc from original code
- Focus on public APIs and main functionality

## Requirement
**Priority order** (extract in this sequence):
1. `class` - Core class definitions
2. `interface` - Type contracts  
3. `function` - Standalone functions
4. `method` - Class methods
5. `property` - Class properties/fields
6. `variable` - Important variables
7. `enum` - Enumeration types
8. `decorator` - Annotations/metadata
9. `namespace` - Module organization
10. `type` - Type definitions
11. `event` - Event handlers
12. `parameter` - Function parameters

## Formating
### Structure
@@ fullpath/filename.extension
⋮... // Description
│    -> Snippet based on requirement
│    -> Remove all existing jsdocs or comment
⋮... // Description
│    -> More snippet if exists
⋮... // Description
│    -> Repeat

### Example
@@ path/subpath/filename.extension
⋮... // File header with imports and module setup
│class Coder:
│    abs_fnames = None
⋮... // Class property for storing absolute file names
│    @classmethod
│    def create(self, main_model, edit_format, io, skip_model_availability_check=False, **kwargs):
⋮... // Factory method to create Coder instance with configuration
│    def abs_root_path(self, path):
⋮... // Method to get absolute root path from relative path
│    def run(self, with_message=None):
⋮... // Main execution method that runs the coder process

## More Example
### Javascript
@@ src/utils/calculator.js
⋮... // File imports and module setup
│class Calculator {
⋮... // Calculator class with arithmetic operations
│    constructor()
⋮... // Initialize calculator with empty history
│    add(a, b)
⋮... // Add two numbers and store in history
│    subtract(a, b)
⋮... // Subtract two numbers and store in history
│    multiply(a, b)
⋮... // Multiply two numbers and store in history
│    divide(a, b)
⋮... // Divide two numbers with zero check
│    getHistory()
⋮... // Return calculation history array
│    clearHistory()
⋮... // Clear all calculation history
│}

### TypeScript
@@ src/interfaces/User.ts
⋮... // File imports and type definitions
│interface User
⋮... // User interface with required properties
│    id: number
⋮... // Unique identifier property
│    name: string
⋮... // User display name property
│    email: string
⋮... // User email address property
│    createdAt: Date
⋮... // Account creation timestamp
│    updatedAt: Date
⋮... // Last modification timestamp
│class UserService
⋮... // UserService class for user management
│    private users: User[]
⋮... // Private array to store user data
│    constructor()
⋮... // Initialize empty users array
│    async createUser(userData: Omit<User, 'id'>): Promise<User>
⋮... // Create new user with generated ID
│    async getUserById(id: number): Promise<User | null>
⋮... // Find user by ID or return null
│    async updateUser(id: number, updates: Partial<User>): Promise<User | null>
⋮... // Update existing user with partial data
│    async deleteUser(id: number): Promise<boolean>
⋮... // Remove user by ID and return success status
│    private validateUser(user: User): boolean
⋮... // Validate user data before operations
│    private generateId(): number
⋮... // Generate unique ID for new users

## IMPORTANT: Response Format
- You MUST respond with valid JSON only - no other text or comments
- No markdown code blocks or extra formatting when returning the code

Please return with JSON format following this structure :
{
  "content": "PUT_REPO_MAP_CONTENT", // Full repo map with @@ file path, ⋮... descriptions, and │ symbol lines
  "description": "One paragraph description", // Brief summary of what the code does and its purpose
  "keywords": "keyword for finding this content" // Minimal 3 word each separator, max 5 keyword (separator by comma)
}

### Example Response
{
  "content": "@@ src/utils/calculator.js\n⋮... // File imports and module setup\n│class Calculator {\n⋮... // Calculator class with arithmetic operations\n│    constructor()\n⋮... // Initialize calculator with empty history\n│    add(a, b)\n⋮... // Add two numbers and store in history\n│    subtract(a, b)\n⋮... // Subtract two numbers and store in history\n│    multiply(a, b)\n⋮... // Multiply two numbers and store in history\n│    divide(a, b)\n⋮... // Divide two numbers with zero check\n│    getHistory()\n⋮... // Return calculation history array\n│    clearHistory()\n⋮... // Clear all calculation history\n│}",
  "description": "A Calculator class that performs basic arithmetic operations (addition, subtraction) and maintains a history of all calculations. Includes constructor initialization, calculation methods, and history management functionality.",
  "keywords": "calculator class methods, arithmetic operations math, addition subtraction functions, calculation history tracking, constructor initialization setup, javascript utility class"
}
