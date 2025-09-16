## Endpoint

https://ollama.com/api/chat

## Headers

- Key: Authorization
- Value: xxxxxxxxxxxxxx

## Body

```json
{
    "model": "qwen3-coder:480b",
    "messages": [
        {
            "role": "system",
            "content": "<GET_FROM_/prompt/system.md>"
        },
        {
            "role": "user",
            "content": "<GET_FROM_/prompt/user.md>"
        }
    ],
    "format": {
        "type": "object",
        "properties": {
            "content": {
                "type": "string",
                "description": "Full repo map with @@ file path, ⋮... descriptions, and │ symbol lines"
            },
            "description": {
                "type": "string",
                "description": "One paragraph description of what the code does and its purpose"
            },
            "keywords": {
                "type": "string",
                "description": "Minimal 3 word each separator, max 5 keyword (separator by comma)"
            }
        },
        "required": [
            "content",
            "description",
            "keywords"
        ]
    },
    "think": (true, false, 'low', 'medium', 'high'),
    "stream": false
}
```
