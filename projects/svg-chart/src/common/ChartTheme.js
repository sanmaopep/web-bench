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

const theme = 'default'

export const themes = {
  default: {
    colors: ['#6083E7', '#DB746B', '#68D5BE', '#445DA3', '#9B524B', '#BDC0C2'],
  },
  dark: {
    colors: ['#BDCCF4', '#BBE3F5', '#B8EAE1', '#C0E7B4', '#DFEB9E', '#F2E4AF'],
  },
}

export function getColor(index) {
  const colors = themes[theme].colors
  return colors[index % colors.length]
}

export const col = getColor
