#!/bin/bash
# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


n=${1:-0}
rest_args="${@:2}"
tasks=""
# Check if init.spec exists
if [ -f "test/init.spec.js" ]; then
  tasks="test/init.spec"
fi

if [[ "$1" == "--help" || "$1" == "-h" ]]; then
  echo -e "--all, -a \t run all tests"
  echo -e "{number} \t run tests from task-1 to task-n"
  echo -e "--help, -h \t help info"
  exit
elif [[ "$1" == "--all" || "$1" == "-a" ]]; then
  tasks="test/*"
elif [ "$n" -gt 0 ]; then
  tasks1=$(seq -f "test/task-%g.spec" 1 "$n" | tr '\n' ' ' | sed 's/ $//')
  tasks="$tasks $tasks1"
elif [ "$n" -eq 0 ] && [ -z "$tasks" ]; then
  # Exit if n=0 and init.spec doesn't exist
  echo "No tests to run: init.spec not found and n=0"
  exit 0
fi

echo "$tasks $rest_args"
npx playwright test $tasks $rest_args
