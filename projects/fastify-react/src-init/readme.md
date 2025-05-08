# Fastify-React Shopping Mall

This is a Fastify-React shopping mall project.

Here is the libs used in this project:

- "@fastify/autoload": "~6.3.0"
- "@fastify/cookie": "~11.0.2"
- "fastify": "~5.3.0"
- "fastify-plugin": "~5.0.1"
- "@fastify/static": "~8.1.1"
- "sqlite3": "^5.1.7"
- "jose": "^5.9.6"
- "react": "^18.3.1"
- "react-dom": "^18.3.1"
- "react-router": "~7.5.0"


Project Structure:

- **index.ts**
  - App entry
- **plugins/**
  - Backend API Plugin, plugins will be auto-loaded in App entry
- **client/**
  - Client Side source code written by React.
- **public/**
  - Compiled Client output, will be auto-loaded by @fastify/static in App entry
