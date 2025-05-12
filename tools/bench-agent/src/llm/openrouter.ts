// Copyright (c) 2023-2024 Continue Dev, Inc.
// Copyright (c) 2025 Bytedance Ltd.
// SPDX-License-Identifier: Apache-2.0
//
// This file has been modified by OpenAILLM Ltd on OpenRouter
//
// Original file was released under Apache-2.0, with the full license text
// available at https://github.com/continuedev/continue?tab=Apache-2.0-1-ov-file.
//
// This modified file is released under the same license.

import { OpenAILLM } from './openai'

export class OpenRouter extends OpenAILLM {
  provider = 'openrouter'

  useLegacyCompletionsEndpoint = false
}
