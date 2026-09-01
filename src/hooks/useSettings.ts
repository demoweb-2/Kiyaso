import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Settings } from '@/types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (mounted && data) setSettings(data);
    };

    load();

    const channel = supabase
      .channel('settings-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        load();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return settings;
}
