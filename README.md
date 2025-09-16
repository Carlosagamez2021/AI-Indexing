# Code Indexing Prompts & Testing

<div align="center">
  <img src="./screenshot/preview.png" alt="Tool Calling and Semantic Search in Action" width="800" />
</div>

> This folder contains prompts and testing for converting source code into structured repository maps that look like Aider's repomap format. The maps contain key symbols (classes, functions, interfaces) with their signatures, optimized for semantic search and LLM understanding. [Reference: Aider Repomap](https://aider.chat/docs/repomap.html)

### **What's Included**

1. **System Prompts** - Structured prompts for LLM processing
2. **Testing Data** - Performance comparison across different models
3. **Examples** - Sample code and expected repository map outputs
4. **Documentation** - How to use the prompts for indexing
5. **CLI Scripts** - Ready-to-use tool calling examples and workflows ([📁 View Scripts](./scripts/))

### **🚀 Quick Start with CLI Scripts**

Get started immediately with our command-line interface that provides ready-to-use examples:

```bash
# Initialize the database
npx tsx ./scripts/index.ts init

# Index your codebase
npx tsx ./scripts/index.ts indexing

# Run tool calling example
npx tsx ./scripts/index.ts tool-calling

# Show help
npx tsx ./scripts/index.ts help
```

> **⚠️ Configuration Required**: Set your API key if you're using the Ollama endpoint. Edit the code in the `./scripts` folder to configure your credentials.

**Available Commands:**

- `init` - Initialize the database with proper schema
- `indexing` - Process and index your entire codebase
- `tool-calling` - Demonstrate semantic search and tool calling workflow
- `help` - Display available commands and usage

**Example:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUserById(id: number): User | null {
    return this.users.find((u) => u.id === id) || null;
  }
}
```

**Becomes:**

```
@@ /src/utils/helper.ts
⋮... // User interface and service definitions
│interface User {
│  id: number
│  name: string
│  email: string
│}
⋮... // UserService class with CRUD operations
│class UserService {
│  private users: User[]
│  addUser(user: User): void
│  getUserById(id: number): User | null
│}
```

---

## 🔄 Workflow

### Indexing Process

The indexing workflow converts raw source code into structured repository maps that are optimized for semantic search and LLM understanding. This process creates a searchable knowledge base of your codebase without requiring complex AST parsing.

```mermaid
flowchart LR
    A[📁 Scan Workspace] --> B[📄 Read Files]
    B --> C[🤖 Send to LLM]
    C --> D[🗂️ Generate Repo Map]
    D --> E[💾 Store to Database]
```

**Detailed Steps:**

1. **📁 Scan Workspace** - Discover all source code files recursively
2. **📄 Read Files** - Extract file contents with absolute paths for context
3. **🤖 Send to LLM** - Process files with specialized prompts for code understanding
4. **🗂️ Generate Repo Map** - Create Aider-format maps with key symbols and context
5. **💾 Store to Database** - Persist maps for fast semantic search retrieval

> **Note**: Vector databases are not required for this indexing approach. Both **SQL** and **NoSQL** databases are suitable for storing the generated repository maps. The structured format allows for efficient text-based search and retrieval.

### Retrieval Process

The retrieval workflow enables intelligent code assistance by allowing the LLM to dynamically search and read relevant code sections based on user queries. This creates a conversational coding experience where the AI can understand context and provide targeted help.

**System Requirements:**

- **Semantic Search Tool** (Required) - Enables finding relevant code sections based on meaning
- **Read File Tool** (Required) - Allows reading specific files for detailed analysis

**Process Flow:**

- **User Query** → User asks for help (e.g., "please help me fix this code")
- **LLM Analysis** → AI determines if additional context is needed
- **Context Search** → If needed, LLM calls Semantic Search to find relevant code
- **Detailed Analysis** → If more details required, LLM reads specific files
- **Response Generation** → LLM processes all information and provides solution
- **Iterative Loop** → Process repeats for follow-up questions until user is satisfied

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant L as 🤖 LLM
    participant S as 🔍 Semantic Search
    participant F as 📄 Read File

    U->>L: "Please help me fix this code"
    L->>L: Analyze request

    alt Need Context?
        L->>S: Search for relevant code
        S-->>L: Return search results
        L->>L: Process search results

        alt Need More Details?
            L->>F: Read specific file
            F-->>L: Return file content
            L->>L: Analyze file content
        end
    end

    L->>L: Generate response
    L-->>U: Send answer with solution

    alt More Questions?
        U->>L: Follow-up question
        Note over U,L: Process repeats...
    else No More Questions
        Note over U: ✅ End
    end
```

---

## 📝 How to Index Code

This section explains how to implement the code indexing system. The process requires minimal setup and provides structured code analysis for semantic search.

### **Quick Steps**

1. **Send code to LLM** with specialized system prompt that understands code structure
2. **Get repository map** in standardized Aider format with key symbols and context
3. **Save for semantic search** by storing the structured maps in your preferred database

### **Implementation Details**

**Prerequisites:**

- Access to an LLM API (Ollama, OpenAI, Anthropic, etc.)
- Database for storing repository maps (SQLite, PostgreSQL, MongoDB, etc.)
- File system access to scan and read source code files

**Key Benefits:**

- **No AST Parsing Required** - Let the LLM handle code understanding
- **Language Agnostic** - Works with any programming language the LLM understands
- **Context Aware** - Captures relationships between symbols and their usage
- **Search Optimized** - Output format is designed for efficient semantic search

### **Example Request**

````json
{
  "model": "deepseek-v3.1:671b",
  "messages": [
    {
      "role": "system",
      "content": "Convert code to repository map format..."
    },
    {
      "role": "user",
      "content": "File: /src/utils/helper.ts\n\n```typescript\ninte..."
    }
  ],
  "format": {
    "type": "object",
    "properties": {
      "content": { "type": "string" },
      "description": { "type": "string" },
      "keywords": { "type": "string" }
    },
    "required": ["content", "description", "keywords"]
  }
}
````

### **Example Output**

```json
{
  "content": "@@ /src/utils/helper.ts\n⋮... // User ....",
  "description": "User interface and service for managing users",
  "keywords": "keyword 1, keyword 2, ..."
}
```

**🤖 [View System Prompt](./prompt/system.md)** - _System prompt for code indexing_  
**👤 [View User Prompt](./prompt/user.md)** - _User prompt template for code indexing_

---

## 📊 Performance Comparison

Our comprehensive testing across different AI models reveals significant performance variations. The benchmarks were conducted using real-world codebases with varying complexity levels, measuring both processing speed and output accuracy.

**Testing Methodology:**

- **Dataset**: 100+ code files across multiple languages (TypeScript, Python, JavaScript, Go)
- **Metrics**: Processing time per file and accuracy of generated repository maps
- **Accuracy**: Measured by manual review of symbol extraction, signature correctness, and context preservation

**📋 [View Testing Documentation](./testing.md)** - _Detailed testing procedures and methodology_

| Model                             | Speed | Accuracy | Think Mode | Recommendation            |
| --------------------------------- | ----- | -------- | ---------- | ------------------------- |
| **gpt-oss:20b** (think-low)       | 1.38s | 82%      | Low        | ⭐ **Fast Processing**    |
| **deepseek-v3.1:671b** (no-think) | 2.05s | 90%      | No         | ⭐ **Best Overall**       |
| **gpt-oss:20b** (no-think)        | 2.33s | 75%      | No         | ⚠️ **Fast but Basic**     |
| **qwen3-coder:480b** (no-think)   | 2.43s | 80%      | No         | ⭐ **Fast & Good**        |
| **deepseek-v3.1:671b** (think)    | 2.51s | 95%      | Yes        | ⭐ **Most Accurate**      |
| **gpt-oss:120b** (think-low)      | 3.70s | 92%      | Low        | ⭐ **Good Speed/Quality** |
| **gpt-oss:120b** (no-think)       | 4.90s | 85%      | No         | ⭐ **Good Balance**       |
| **qwen3-coder:480b** (think)      | 4.80s | 85%      | Yes        | ⭐ **Reliable**           |
| **gpt-oss:120b** (think-medium)   | 5.34s | 95%      | Medium     | ⭐ **Balanced**           |
| **gpt-oss:120b** (think-high)     | 13.9s | 98%      | High       | ⭐ **Most Precise**       |
| **gpt-oss:20b** (think-high)      | 24.1s | 88%      | High       | ⚠️ **Slow but Detailed**  |
| **gpt-oss:20b** (think-medium)    | 24.1s | 85%      | Medium     | ⚠️ **Slow Processing**    |

**Performance Insights:**

- **Think Mode**: Higher levels boost accuracy 5-15% but increase processing time 2-10x
- **Model Size**: 120B models consistently outperform 20B, especially with think modes
- **Speed Tiers**:
  - **Ultra-Fast** (1-3s): Basic processing for simple codebases
  - **Fast** (3-6s): Good balance for most use cases
  - **Balanced** (5-15s): Optimal production performance
  - **Precise** (15-25s): Maximum accuracy for complex codebases
- **Top Performers**: GPT-OSS 120B (think-high) hits 98% accuracy; deepseek-v3.1:671b offers best value
- **Resource Trade-off**: Think modes deliver superior results at 2-10x processing cost

**📁 [View Detailed Comparison Results](./comparison)** - _Raw performance data and test results_

---

## 💡 Pro Tips & Best Practices

- **Improve Semantic Accuracy**: Filter by nearest path to enhance search precision
- **Targeted Context**: Use specific file targeting and edit prompts to include relevant context
- **Offline Capability**: We recommend **qwen3** for complex prompts or multi-step workflows
- **Result**: LLM will never be confused again with no complexity behind the scenes

> **Implementation Example**: The [`scripts`](./scripts/) folder provides examples of how to implement this in a simple way, using SQLite for the database. In real applications, you can also index the database and filter with proper algorithms.

> **Pro Tip**: Use root path detection with [`Project-Root`](https://github.com/NeaByteLab/Project-Root) to filter file paths and improve semantic search accuracy. This ensures the system gets proper context by matching project paths, resulting in more accurate and relevant content retrieval.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📚 References

- [Aider Repomap Documentation](https://aider.chat/docs/repomap.html) - _Inspiration for repo map format_
- [Ollama Tool Support](https://ollama.com/blog/tool-support) - _Tool calling capabilities for retrieval workflow_
- [Ollama Blog](https://ollama.com/blog) - _Latest features and capabilities_
