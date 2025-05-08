const { test, expect, defineConfig } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    window.store.mode = 'debug';
  });
  await page.click('canvas');
});

test('should enter coin space when boss is defeated', async ({ page }) => {
  // Wait for boss spawn time
  await page.waitForTimeout(10000);
  // Set up boss with 1 life
  await page.evaluate(() => {
    window.store.boss = {
      ...window.store.boss,
      lives: 1,
    };
  });

  // Use bomb
  await page.keyboard.press('b');
  await page.waitForTimeout(100);

  // Verify entered coin phase
  const coinPhaseActive = await page.evaluate(() => window.store.coinPhase.active || window.store.coinPhase.isActive);
  expect(coinPhaseActive).toBe(true);

  // Verify initial state
  const store = await page.evaluate(() => window.store);
  expect(store.pipes.length).toBe(0); // No pipes
  expect(store.enemies.length).toBe(0); // No enemies
  expect(store.bossBullets.length).toBe(0); // No boss bullets
});


test('should control bird movement in coin phase', async ({ page }) => {
  // Wait for boss spawn time
  await page.waitForTimeout(10000);
  // Set up boss with 1 life
  await page.evaluate(() => {
    window.store.boss = {
      ...window.store.boss,
      lives: 1,
    };
  });

  // Use bomb
  await page.keyboard.press('b');
  await page.waitForTimeout(100);

  // Test left movement
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(100);
  const leftPosition = await page.evaluate(() => window.store.bird.x);

  // Test right movement
  await page.keyboard.up('ArrowLeft');
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(100);
  const rightPosition = await page.evaluate(() => window.store.bird.x);

  expect(rightPosition).toBeGreaterThan(leftPosition);
});
