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

function getRandomDescription() {
  const words = [
    'stunning',
    'powerful',
    'innovative',
    'premium',
    'versatile',
    'elegant',
    'durable',
    'fast',
    'smooth',
    'responsive',
    'advanced',
    'high-quality',
    'comfortable',
    'stylish',
    'modern',
    'sleek',
    'efficient',
    'reliable',
    'feature-rich',
    'cutting-edge',
    'smart',
    'intuitive',
    'user-friendly',
    'portable',
    'lightweight',
    'compact',
    'ergonomic',
    'sophisticated',
    'professional',
    'exceptional',
    'outstanding',
    'remarkable',
    'impressive',
  ]

  const sentences = [
    'This product offers exceptional performance and reliability.',
    'Designed with cutting-edge technology and premium materials.',
    'Features a sleek and modern design that stands out.',
    'Provides outstanding value with its versatile functionality.',
    'Built to last with durable construction and quality components.',
    'Offers intuitive controls and user-friendly interface.',
    'Delivers impressive results with its advanced features.',
    'Combines style and functionality in a compact package.',
  ]

  const randomWords = Array.from(
    { length: 5 },
    () => words[Math.floor(Math.random() * words.length)]
  )
  const randomSentence = sentences[Math.floor(Math.random() * sentences.length)]

  return `${randomWords.join(' ')}. ${randomSentence}`
}

function getRandomImage() {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3', '#33FFF3']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="30" fill="${randomColor}" />
    <text x="50" y="55" font-family="Arial" font-size="20" text-anchor="middle" fill="${randomColor}">SKU</text>
  </svg>`

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export function getMockSKU(params = {}) {
  return {
    name: `SKU ${Math.random().toString(36).substring(2, 15)}`,
    price: 100,
    image: getRandomImage(),
    description: getRandomDescription(),
    quantity: 100,
    ...params,
  }
}
