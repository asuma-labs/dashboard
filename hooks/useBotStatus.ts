import { useState, useEffect, useCallback } from 'react';
import { botService } from '../services/bot.service';
import { BotStatus, CloneBot, SystemStats } from '../types/bot';
import { useAuthStore } from '../store/auth.store';

export const useBotStatus = (refreshInterval = 30000) => {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [clones, setClones] = useState<CloneBot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setError(null);
      
      const [statusRes, statsRes, clonesRes] = await Promise.all([
        botService.getStatus(),
        botService.getSystemStats(),
        botService.getClones()
      ]);

      if (statusRes.success) setStatus(statusRes.data);
      if (statsRes.success) setSystemStats(statsRes.data);
      if (clonesRes.success) setClones(clonesRes.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message || error?.message || 'Failed to fetch bot status');
    } finally {
      if (loading) setLoading(false);
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();

    // Setup auto-refresh
    let intervalId: ReturnType<typeof setInterval>;
    if (isAuthenticated && refreshInterval > 0) {
      intervalId = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData, refreshInterval, isAuthenticated]);

  return {
    status,
    systemStats,
    clones,
    loading,
    error,
    refetch: fetchData
  };
};
