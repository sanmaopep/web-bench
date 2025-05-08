# Bench Evaluator

## 1. Install

```
rush update
```

## 2. Build

```
rush build
```

## 3. Evaluate

```
rush eval
```

Please check local config files if:

### 3.1. Use http agent

- `./src/config.json5`, you should create this file locally

```json
{
  "projects": ["@web-bench/calculator", "@web-bench/calculator-files"],
  "agentMode": "http", 
  "agentEndPoint": "http://example.com/path/to/agent",
}
```

### 3.2. Use local agent

- `./src/config.json5`, you should create this file locally

```json
{
  "projects": ["@web-bench/calculator", "@web-bench/calculator-files"],
  "models": ["claude-3-5-sonnet-20241022", "openai/gpt-4o"],
  "agentMode": "local",
}
```

- `./.env`, you should create this file locally

```bash
ANTHROPIC_API_KEY=xxx
OPENROUTER_API_KEY=xxx
# Comment
# OPENAI_API_KEY=xxx
```

XXX_API_KEY is used in `./src/model.json`

```json
{
  "models": [
    {
      "model": "claude-3-5-sonnet-20241022",
      "apiKey": "{{ANTHROPIC_API_KEY}}"
    },
    {
      "model": "openai/gpt-4o",
      "apiKey": "{{OPENROUTER_API_KEY}}"
    }
  ]
}  
```
