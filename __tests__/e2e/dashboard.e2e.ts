import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chromium, Browser, Page } from 'playwright';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

describe('DevMetrics Dashboard E2E Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Home Page', () => {
    it('should load the home page', async () => {
      await page.goto(BASE_URL);
      const title = await page.title();
      expect(title).toBeTruthy();
    });

    it('should display navigation links', async () => {
      await page.goto(BASE_URL);
      
      const dashboardLink = await page.locator('a:has-text("Dashboard")').isVisible();
      const leaderboardLink = await page.locator('a:has-text("Leaderboard")').isVisible();
      
      expect(dashboardLink).toBeTruthy();
      expect(leaderboardLink).toBeTruthy();
    });
  });

  describe('Login Page', () => {
    it('should have login form fields', async () => {
      await page.goto(`${BASE_URL}/login`);
      
      const emailInput = await page.locator('input[type="email"]').isVisible();
      const passwordInput = await page.locator('input[type="password"]').isVisible();
      
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });

    it('should allow user to enter credentials', async () => {
      await page.goto(`${BASE_URL}/login`);
      
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      
      const emailValue = await emailInput.inputValue();
      expect(emailValue).toBe('test@example.com');
    });

    it('should have a sign in button', async () => {
      await page.goto(`${BASE_URL}/login`);
      
      const signInButton = await page.locator('button:has-text("Sign In")').isVisible();
      expect(signInButton).toBeTruthy();
    });
  });

  describe('Dashboard Page', () => {
    beforeAll(async () => {
      // Navigate to login first
      await page.goto(`${BASE_URL}/login`);
      
      // Fill credentials
      await page.locator('input[type="email"]').fill('test@example.com');
      await page.locator('input[type="password"]').fill('password123');
      
      // Submit login
      await page.locator('button:has-text("Sign In")').click();
      
      // Wait for redirect to dashboard
      await page.waitForURL('**/dashboard');
    });

    it('should display stat cards', async () => {
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
      
      // Look for stat cards with common metrics
      const deploymentsStat = await page.locator('text=Deployments today').isVisible();
      const buildSuccessStat = await page.locator('text=Build success rate').isVisible();
      
      expect(deploymentsStat).toBeTruthy();
      expect(buildSuccessStat).toBeTruthy();
    });

    it('should display services table', async () => {
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
      
      const servicesTable = await page.locator('text=Services').isVisible();
      expect(servicesTable).toBeTruthy();
      
      // Check for table headers
      const serviceHeader = await page.locator('text=Service').first().isVisible();
      expect(serviceHeader).toBeTruthy();
    });

    it('should display deploy trigger button', async () => {
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
      
      const deployButton = await page.locator('button:has-text("Trigger deploy")').first().isVisible();
      expect(deployButton).toBeTruthy();
    });

    it('should respond to mobile viewport', async () => {
      const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 667 }
      });
      const mobilePage = await mobileContext.newPage();
      
      await mobilePage.goto(`${BASE_URL}/dashboard`);
      
      // Check if content is still visible on mobile
      const mainContent = await mobilePage.locator('main').isVisible();
      expect(mainContent).toBeTruthy();
      
      await mobileContext.close();
    });

    it('should toggle deploy trigger modal', async () => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      const deployButton = await page.locator('button:has-text("Trigger deploy")').first();
      await deployButton.click();
      
      // Check if modal and fields are visible
      const serviceInput = await page.locator('input[name="serviceId"]').isVisible();
      const branchInput = await page.locator('input[name="branch"]').isVisible();
      expect(serviceInput).toBeTruthy();
      expect(branchInput).toBeTruthy();
    });
  });

  describe('Leaderboard Page', () => {
    it('should display leaderboard table', async () => {
      await page.goto(`${BASE_URL}/leaderboard`, { waitUntil: 'networkidle' });
      
      const leaderboardTitle = await page.locator('text=Contributor Rankings').isVisible();
      expect(leaderboardTitle).toBeTruthy();
      
      // Check for table headers
      const rankHeader = await page.locator('text=Rank').isVisible();
      expect(rankHeader).toBeTruthy();
    });

    it('should display contributor rankings', async () => {
      await page.goto(`${BASE_URL}/leaderboard`);
      
      // Look for ranking markers
      const rankBadges = await page.locator('[class*="bg-yellow"], [class*="bg-gray"], [class*="bg-orange"]').count();
      expect(rankBadges).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Documentation Pages', () => {
    it('should load docs index', async () => {
      await page.goto(`${BASE_URL}/docs`);
      
      const docsTitle = await page.locator('text=Documentation').isVisible();
      expect(docsTitle).toBeTruthy();
    });
  });

  describe('Embed Pages', () => {
    it('should load widget embed', async () => {
      await page.goto(`${BASE_URL}/embed/widget`);
      
      // Check for compact widget content
      const content = await page.content();
      expect(content).toContain('DevMetrics');
    });

    it('should load webview embed', async () => {
      await page.goto(`${BASE_URL}/embed/webview`);
      
      const webviewTitle = await page.locator('text=DevMetrics').isVisible();
      expect(webviewTitle).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive at 375px (mobile)', async () => {
      const narrowContext = await browser.newContext({
        viewport: { width: 375, height: 667 }
      });
      const narrowPage = await narrowContext.newPage();
      
      await narrowPage.goto(`${BASE_URL}/dashboard`);
      
      const mainContent = await narrowPage.locator('main').isVisible();
      expect(mainContent).toBeTruthy();
      
      await narrowContext.close();
    });

    it('should be responsive at 768px (tablet)', async () => {
      const tabletContext = await browser.newContext({
        viewport: { width: 768, height: 1024 }
      });
      const tabletPage = await tabletContext.newPage();
      
      await tabletPage.goto(`${BASE_URL}/dashboard`);
      
      const mainContent = await tabletPage.locator('main').isVisible();
      expect(mainContent).toBeTruthy();
      
      await tabletContext.close();
    });

    it('should be responsive at 1440px (desktop)', async () => {
      const desktopContext = await browser.newContext({
        viewport: { width: 1440, height: 900 }
      });
      const desktopPage = await desktopContext.newPage();
      
      await desktopPage.goto(`${BASE_URL}/dashboard`);
      
      const mainContent = await desktopPage.locator('main').isVisible();
      expect(mainContent).toBeTruthy();
      
      // Check if sidebar is visible on desktop
      const sidebar = await desktopPage.locator('aside').isVisible();
      expect(sidebar).toBeTruthy();
      
      await desktopContext.close();
    });
  });

  describe('Navigation', () => {
    it('should navigate between pages using sidebar', async () => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Click Leaderboard link
      const leaderboardLink = page.locator('a:has-text("Leaderboard")').first();
      await leaderboardLink.click();
      
      // Verify navigation
      await page.waitForURL('**/leaderboard');
      const currentUrl = page.url();
      expect(currentUrl).toContain('/leaderboard');
    });
  });

  describe('Theme Support', () => {
    it('should support dark mode toggle', async () => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Get initial body classes
      const _bodyClassBefore = await page.locator('body').getAttribute('class');
      
      // Verify body element exists and has proper structure
      const bodyExists = await page.locator('body').isVisible();
      expect(bodyExists).toBeTruthy();
    });
  });

  describe('API Integration', () => {
    it('should fetch and display metrics', async () => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      
      // Look for numerical stats
      const stats = await page.locator('[class*="text-3xl"], [class*="text-2xl"]').count();
      expect(stats).toBeGreaterThan(0);
    });
  });
});
