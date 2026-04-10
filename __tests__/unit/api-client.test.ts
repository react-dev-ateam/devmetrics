import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDeployments, getServices, getMetrics, getLeaderboard } from '@/lib/api-client';

describe('API Client', () => {
  const fetchMock = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = fetchMock;
  });

  describe('getDeployments', () => {
    it('should fetch deployments', async () => {
      const mockDeployments = [
        {
          id: '1',
          service: 'api-service',
          version: 'v1.0.0',
          environment: 'prod' as const,
          timestamp: new Date().toISOString(),
          status: 'success' as const,
          duration: 120,
          triggeredBy: 'user1',
        },
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeployments,
      });

      const result = await getDeployments();
      expect(result).toEqual(mockDeployments);
      expect(fetchMock).toHaveBeenCalled();
    });

    it('should throw on API error', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getDeployments()).rejects.toThrow();
    });
  });

  describe('getDashboardSummary', () => {
    it('should fetch dashboard summary', async () => {
      const mockSummary = {
        total_services: 12,
        healthy_services: 11,
        deployments_today: 48,
        open_incidents: 2,
        avg_deploy_duration_ms: 45000,
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummary,
      });

      const result = await getMetrics();
      expect(result).toEqual(mockSummary);
    });
  });

  describe('getServices', () => {
    it('should fetch services list', async () => {
      const mockServices = {
        data: [
          {
            id: 'svc_api-gateway',
            name: 'api-service',
            status: 'healthy' as const,
            uptime: 99.98,
            owner: 'usr_alice',
            environment: 'production' as const,
            last_deploy_at: new Date().toISOString(),
            avg_build_ms: 45000,
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockServices,
      });

      const result = await getServices();
      expect(result).toEqual(mockServices);
    });
  });

  describe('getLeaderboard', () => {
    it('should fetch leaderboard entries', async () => {
      const mockLeaderboard = [
        {
          rank: 1,
          contributor: 'Alice',
          deployments: 156,
          prsMerged: 89,
          incidentsResolved: 12,
          streak: 15,
        },
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLeaderboard,
      });

      const result = await getLeaderboard();
      expect(result).toEqual(mockLeaderboard);
    });
  });
});
