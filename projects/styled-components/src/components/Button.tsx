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

import styled from 'styled-components'

const StyledButton = styled.button<{ $type: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  margin-left: 1rem;
  background-color: ${({ $type, theme }) =>
    $type === 'primary'
      ? theme.buttonPrimary
      : $type === 'secondary'
      ? theme.buttonSecondary
      : theme.buttonDanger};
  transition: opacity 0.3s ease, transform 0.3s ease;

  &:hover {
    opacity: 0.7;
  }

  &:focus {
    transform: scale(1.2);
    outline: none;
  }
`

export default StyledButton
