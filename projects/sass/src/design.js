// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { SurveyDesign } from './common/SurveyDesign.js'

document.addEventListener('DOMContentLoaded', () => {
  const dataKey = new URL(location.href).searchParams.get('key') ?? 'data'
  const data = JSON.parse(localStorage[dataKey] ?? '{"title":"Sample Survey", "questions":[]}')
  new SurveyDesign('form', data)
})
