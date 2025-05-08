const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForTimeout(200);
  await page.click('canvas');
});

// Test enemy spawning
test('should spawn enemies periodically', async ({ page }) => {
  await page.evaluate(() => {
    window.store.mode = 'debug';
  });
  // Initially should have no enemies
  const initialEnemies = await page.evaluate(() => window.store.enemies.length);
  
  // Wait for enemies to spawn
  await page.waitForTimeout(1100);
  
  // Should have spawned some enemies
  const enemiesAfterDelay = await page.evaluate(() => window.store.enemies.length);
  expect(enemiesAfterDelay).toBe(initialEnemies + 1);
});

// Test enemy collision with player
test('enemy collision should reduce player lives', async ({ page }) => {
  // Set initial lives
  await page.evaluate(() => {
    window.store.lives = 3;
    window.store.mode = 'debug';
  });
  // Wait for enemies to spawn
  await page.waitForTimeout(1100);

  await page.evaluate(() => {
    window.store.mode = 'normal';
  });

  const result = await page.evaluate(async () => {
     // Setup heart item
     const enemy =  store.enemies[0];

     // Move bird to item position
     store.bird.x = enemy.x + 10;
     store.bird.y = enemy.y + 10;
    
     await new Promise(resolve => setTimeout(resolve, 100));
     const newStore = window.store;
    
    return {
      lives: newStore.lives,
    };
  });

  expect(result.lives).toBe(2);
});
