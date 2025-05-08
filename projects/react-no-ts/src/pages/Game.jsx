import React, { useState, useCallback } from 'react';
import { showToast } from '../utils/toast';

function Game({ navigate }) {
  const BOARD_SIZE = 15;
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)));
  const [isBlackTurn, setIsBlackTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState([]);

  const checkWin = useCallback((row, col, player) => {
    const directions = [
      [1, 0],  // horizontal
      [0, 1],  // vertical 
      [1, 1],  // diagonal
      [1, -1]  // anti-diagonal
    ];

    return directions.some(([dx, dy]) => {
      let count = 1;
      
      // Check forward
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break;
        if (board[newRow][newCol] !== player) break;
        count++;
      }

      // Check backward
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break;
        if (board[newRow][newCol] !== player) break;
        count++;
      }

      return count >= 5;
    });
  }, [board]);

  const handleClick = (row, col) => {
    if (board[row][col] || gameOver) return;

    const newBoard = board.map(row => [...row]);
    const player = isBlackTurn ? 'black' : 'white';
    newBoard[row][col] = player;
    setBoard(newBoard);

    const move = `${player.charAt(0).toUpperCase() + player.slice(1)}(${row},${col});`;
    setMoves(prev => [...prev, move]);

    if (checkWin(row, col, player)) {
      setGameOver(true);
      showToast('Congratulations!', { fontSize: '50px' });
      return;
    }

    setIsBlackTurn(!isBlackTurn);
  };

  const handlePostGame = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    const title = `Game-${date}-${time}`;
    const winner = isBlackTurn ? 'Black' : 'White';
    
    const detail = `# ${winner} is Winner!\n\`\`\`game\n${moves.join('\n')}\n\`\`\``;

    window.dispatchEvent(new CustomEvent('blog-created', {
      detail: { title, detail }
    }));

    navigate('/');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#4A90E2',
        marginBottom: '20px'
      }}>
        Hello Game
      </h1>

      <div style={{
        fontSize: '1.5rem',
        marginBottom: '20px',
        color: gameOver ? '#e74c3c' : '#2c3e50',
        fontWeight: 'bold'
      }}>
        {gameOver ? 
          `${isBlackTurn ? 'Black' : 'White'} Wins!` : 
          `${isBlackTurn ? 'Black' : 'White'}'s Turn`}
      </div>

      <div style={{
        backgroundColor: '#deb887',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`chess-pos-${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #8b4513',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: cell || gameOver ? 'not-allowed' : 'pointer',
                  position: 'relative'
                }}
              >
                {cell && (
                  <div
                    className={`chess-${cell}`}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: cell === 'black' ? '#000' : '#fff',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      border: cell === 'white' ? '1px solid #ccc' : 'none'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '20px'
      }}>
        <button
          onClick={() => {
            setBoard(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)));
            setIsBlackTurn(true);
            setGameOver(false);
            setMoves([]);
          }}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#357ABD'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#4A90E2'
          }}
        >
          Restart Game
        </button>

        {gameOver && (
          <button
            onClick={handlePostGame}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#219a52'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#27ae60'
            }}
          >
            Post Game Records
          </button>
        )}
      </div>
    </div>
  );
}

export default Game;