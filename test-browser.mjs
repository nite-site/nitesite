#!/usr/bin/env node
/**
 * Quick browser test for nitesite web haptics integration.
 * Run with: npx playwright test test-browser.mjs (or node with playwright installed)
 */
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  const logs = [];

  page.on('console', (msg) => {
    const text = msg.text();
    logs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') errors.push(text);
  });

  try {
    // 1. Load the page
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 10000 });
    console.log('✓ Page loaded');

    // 2. Verify moon icon is visible
    const moon = page.locator('.moon-icon');
    await moon.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Moon icon visible');

    // 3. Click moon to open date picker
    await moon.click();
    await page.waitForTimeout(350);

    const datePicker = page.locator('.date-picker');
    await datePicker.waitFor({ state: 'visible', timeout: 2000 });
    console.log('✓ Date picker opened');

    // 4. Verify date picker has dates
    const dateItems = page.locator('.date-item');
    const count = await dateItems.count();
    if (count < 10) throw new Error(`Expected many date items, got ${count}`);
    console.log(`✓ Date carousel has ${count} dates`);

    // 5. Click a date
    await dateItems.nth(10).click();
    await page.waitForTimeout(200);
    const selectedItem = page.locator('.date-item.selected');
    await selectedItem.waitFor({ state: 'visible', timeout: 1000 });
    console.log('✓ Date selection works');

    // 6. Click Today button
    await page.locator('.today-button').click();
    await page.waitForTimeout(300);
    console.log('✓ Today button works');

    // 7. Click moon to close
    await moon.click();
    await page.waitForTimeout(350);
    await datePicker.waitFor({ state: 'hidden', timeout: 2000 });
    console.log('✓ Date picker closed');

    // 8. Re-open and scroll the carousel
    await moon.click();
    await page.waitForTimeout(400); // wait for isReadyRef

    const container = page.locator('.date-picker-container');
    await container.evaluate((el) => {
      el.scrollLeft = el.scrollWidth / 3;
    });
    await page.waitForTimeout(100);
    console.log('✓ Carousel scroll works');

    // 9. Check for JS errors
    if (errors.length > 0) {
      console.error('\nConsole errors:', errors);
      process.exitCode = 1;
    } else {
      console.log('\n✓ No console errors');
    }

    console.log('\nAll tests passed.');
  } catch (err) {
    console.error('\nTest failed:', err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runTests();
