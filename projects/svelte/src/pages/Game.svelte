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

<script lang="ts">
  import ToastDisplay from '../components/ToastDisplay.svelte'
  import { navigate } from '../router';
  import { blogs, selectedBlog } from '../stores/blogStore';
  import { toast } from '../utils/toast';
  
  const BOARD_SIZE = 15;
  let board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  let currentPlayer: 'black' | 'white' = 'black';
  let winner: 'black' | 'white' | null = null;
  let moves = 0;
  let moveHistory: string[] = [];

  function checkWin(row: number, col: number, player: 'black' | 'white'): boolean {
    const directions = [
      [1, 0], [0, 1], [1, 1], [1, -1]  
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      
      // Check forward
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        
        if (
          newRow < 0 || newRow >= BOARD_SIZE ||
          newCol < 0 || newCol >= BOARD_SIZE ||
          board[newRow][newCol] !== player
        ) {
          break;
        }
        count++;
      }

      // Check backward
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;

        if (
          newRow < 0 || newRow >= BOARD_SIZE || 
          newCol < 0 || newCol >= BOARD_SIZE ||
          board[newRow][newCol] !== player
        ) {
          break;
        }
        count++;
      }

      if (count >= 5) return true;
    }

    return false;
  }

  function handleClick(row: number, col: number) {
    if (winner || board[row][col]) return;

    board[row][col] = currentPlayer;
    moves++;
    moveHistory.push(`${currentPlayer}(${row},${col})`);

    if (checkWin(row, col, currentPlayer)) {
      winner = currentPlayer;
      toast.showToast('Congratulations!', 50);
    } else {
      currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    }

    board = [...board];
    moveHistory = [...moveHistory];
  }

  function reset() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    currentPlayer = 'black';
    winner = null;
    moves = 0;
    moveHistory = [];
  }

  function postGameRecord() {
    const now = new Date();
    const date = now.toLocaleDateString().replace(/\//g, '-');
    const time = now.toLocaleTimeString().replace(/:/g, '-');
    
    const title = `Game-${date}-${time}`;
    const detail = `# ${winner === 'black' ? 'Black' : 'White'} is Winner!\n\`\`\`game\n${moveHistory.join(';\n')};\n\`\`\``;
    
    const blog = { title, detail };
    blogs.addBlog(blog);
    selectedBlog.set(blog);
    navigate('/');
  }
</script>

<div class="game-container">
  <div class="title">Hello Game</div>
  
  <div class="status">
    {#if winner}
      <span class="winner">{winner === 'black' ? 'Black' : 'White'} Wins!</span>
    {:else}
      {currentPlayer === 'black' ? 'Black' : 'White'}'s Turn
    {/if}
  </div>

  <div class="board">
    {#each board as row, i}
      <div class="row">
        {#each row as cell, j}
          <button 
            class="cell chess-pos-{i}-{j}"
            class:chess-black={cell === 'black'}
            class:chess-white={cell === 'white'}
            on:click={() => handleClick(i, j)}
          >
            {#if cell}
              <div class="chess" />
            {/if}
          </button>
        {/each}
      </div>
    {/each}
  </div>

  <div class="controls">
    <button class="reset-btn" on:click={reset}>Reset Game</button>
    <button class="back-btn" on:click={() => navigate('/')}>Back to Blog</button>
    {#if winner}
      <button class="post-btn" on:click={postGameRecord}>Post Game Records</button>
    {/if}
  </div>
</div>

<ToastDisplay />

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: #f5f5f5;
    min-height: 100vh;
  }

  .title {
    font-size: 2rem;
    color: #4CAF50;
    margin-bottom: 1rem;
  }

  .status {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    height: 2rem;
  }

  .winner {
    color: #4CAF50;
    font-weight: bold;
  }

  .board {
    background: #DEB887;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .row {
    display: flex;
  }

  .cell {
    width: 40px;
    height: 40px;
    border: 1px solid #8B4513;
    background: none;
    padding: 0;
    margin: 0;
    position: relative;
    cursor: pointer;
  }

  .cell:hover:not(.chess-black):not(.chess-white) {
    background: rgba(255, 255, 255, 0.2);
  }

  .chess {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;  
    border-radius: 50%;
  }

  .chess-black .chess {
    background: #000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  }

  .chess-white .chess {
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);  
  }

  .controls {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
  }

  .reset-btn, .back-btn, .post-btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .reset-btn {
    background: #4CAF50;
    color: white;
  }

  .reset-btn:hover {
    background: #45a049;
  }

  .back-btn {
    background: #2196F3;
    color: white;
  }

  .back-btn:hover {
    background: #1976D2;
  }

  .post-btn {
    background: #9C27B0;
    color: white;
  }

  .post-btn:hover {
    background: #7B1FA2;
  }
</style>