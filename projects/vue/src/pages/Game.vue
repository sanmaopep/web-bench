<!-- 
Copyright (c) 2025 Bytedance Ltd. and/or its affiliates

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 -->

<template>
  <div class="game-container">
    <h1>Hello Game</h1>
    <h2>{{ currentPlayerText }}</h2>
    <div class="chess-board">
      <div v-for="row in 15" :key="row" class="chess-row">
        <div 
          v-for="col in 15" 
          :key="col" 
          :class="['chess-cell', `chess-pos-${row-1}-${col-1}`]"
          @click="placePiece(row-1, col-1)"
        >
          <div 
            v-if="board[row-1][col-1] !== null" 
            :class="['chess-piece', board[row-1][col-1] === 'black' ? 'chess-black' : 'chess-white']"
          ></div>
        </div>
      </div>
    </div>
    <h2 v-if="winner">{{ winnerText }}</h2>
    <button v-if="winner" @click="postGameRecords" class="post-button">Post Game Records</button>
    <button @click="resetGame" class="reset-button">Reset Game</button>
    <button @click="goBack" class="back-button">Go Back</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject } from 'vue';
import { showToast } from '../utils/toast';
import { useBlogContext } from '../context/BlogContext';

export default defineComponent({
  name: 'Game',
  setup() {
    const board = ref(Array(15).fill(null).map(() => Array(15).fill(null)));
    const currentPlayer = ref<'black' | 'white'>('black');
    const winner = ref<'black' | 'white' | null>(null);
    const moves = ref<string[]>([]);

    const { addBlog } = useBlogContext()

    const currentPlayerText = computed(() => 
      winner.value ? '' : `${currentPlayer.value === 'black' ? 'Black' : 'White'}'s Turn`
    );

    const winnerText = computed(() => 
      winner.value ? `${winner.value === 'black' ? 'Black' : 'White'} Wins!` : ''
    );

    const placePiece = (row: number, col: number) => {
      if (winner.value || board.value[row][col] !== null) return;

      board.value[row][col] = currentPlayer.value;
      moves.value.push(`${currentPlayer.value === 'black' ? 'Black' : 'White'}(${row},${col})`);

      if (checkWin(row, col)) {
        winner.value = currentPlayer.value;
        showToast('Congratulations!', 3000, { fontSize: '50px' });
      } else {
        currentPlayer.value = currentPlayer.value === 'black' ? 'white' : 'black';
      }
    };

    const checkWin = (row: number, col: number): boolean => {
      const directions = [
        [1, 0], [0, 1], [1, 1], [1, -1]
      ];

      return directions.some(([dx, dy]) => {
        return checkDirection(row, col, dx, dy) + checkDirection(row, col, -dx, -dy) - 1 >= 5;
      });
    };

    const checkDirection = (row: number, col: number, dx: number, dy: number): number => {
      let count = 0;
      let r = row;
      let c = col;

      while (
        r >= 0 && r < 15 && c >= 0 && c < 15 &&
        board.value[r][c] === currentPlayer.value
      ) {
        count++;
        r += dx;
        c += dy;
      }

      return count;
    };

    const resetGame = () => {
      board.value = Array(15).fill(null).map(() => Array(15).fill(null));
      currentPlayer.value = 'black';
      winner.value = null;
      moves.value = [];
    };

    const goBack = () => {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const postGameRecords = () => {
      const now = new Date();
      const title = `Game-${now.toISOString().split('T')[0]}-${now.toTimeString().split(' ')[0]}`;
      const content = `# ${winner.value === 'black' ? 'Black' : 'White'} is Winner!\n\`\`\`game\n${moves.value.join(';\n')};\n\`\`\``;
      addBlog({ title, detail: content });
      goBack();
    };

    return { 
      board, 
      currentPlayer, 
      winner, 
      currentPlayerText,
      winnerText,
      placePiece, 
      resetGame, 
      goBack,
      postGameRecords
    };
  }
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.chess-board {
  display: inline-grid;
  grid-template-columns: repeat(15, auto);
  gap: 1px;
  background-color: #d4a56a;
  padding: 10px;
  border: 2px solid #8b4513;
}

.chess-row {
  display: contents;
}

.chess-cell {
  width: 30px;
  height: 30px;
  background-color: #d4a56a;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.chess-cell::before,
.chess-cell::after {
  content: '';
  position: absolute;
  background-color: #000;
}

.chess-cell::before {
  width: 100%;
  height: 1px;
  top: 50%;
  transform: translateY(-50%);
}

.chess-cell::after {
  width: 1px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.chess-piece {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  z-index: 1;
}

.chess-black {
  background-color: #000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.chess-white {
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.reset-button, .back-button, .post-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-button {
  background-color: #4CAF50;
}

.reset-button:hover {
  background-color: #45a049;
}

.back-button {
  background-color: #008CBA;
}

.back-button:hover {
  background-color: #007B9A;
}

.post-button {
  background-color: #f44336;
}

.post-button:hover {
  background-color: #d32f2f;
}
</style>