#!/bin/bash

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
