import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeTable<T>(
  table: string,
  fetcher: () => Promise<T[]>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetcher().then(setData).finally(() => setLoading(false));
  }, deps);

  useEffect(() => {
    load();

    const channel = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        load();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, ...deps]);

  return { data, loading, reload: load };
}
