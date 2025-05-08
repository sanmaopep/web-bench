const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('background image should load correctly', async ({ page }) => {
  // Check if background image is set in CSS
  const hasBackground = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const computedStyle = window.getComputedStyle(canvas);
    const backgroundImage = computedStyle.backgroundImage;
    
    // Check if background-image is set and not 'none'
    return backgroundImage !== 'none' && backgroundImage !== '';
  });

  expect(hasBackground).toBe(true);

  // Verify background image URL
  const backgroundUrl = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const computedStyle = window.getComputedStyle(canvas);
    return computedStyle.backgroundImage;
  });

  // Should contain the correct image path
  expect(backgroundUrl).toContain('bg.png');
});

test('canvas should be centered on the page', async ({ page }) => {
  // Check if canvas position is actually in center
  const isPositionedCenter = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const rect = canvas.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const expectedLeft = (windowWidth - rect.width) / 2;
    // Allow 10px difference for rounding
    return Math.abs(rect.left - expectedLeft) <= 10;
  });

  expect(isPositionedCenter).toBe(true);
});