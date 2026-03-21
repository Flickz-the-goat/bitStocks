import { supabase } from '../supabase';
import { NewsEvent } from '@/types/gameType';

export async function insertNewsEvents(
  yearId: string,
  events: Omit<NewsEvent, 'id' | 'created_at'>[]
) {
  const rows = events.map((event) => ({
    year_id: yearId,
    title: event.title,
    description: event.description,
    event_type: event.event_type,
    probability: event.probability,
    sector_impacts_if_true: event.sector_impacts_if_true,
    sector_impacts_if_false: event.sector_impacts_if_false,
    resolved: false,
  }));

  const { data, error } = await supabase
    .from('news_events')
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

export async function getNewsByYear(yearId: string) {
  const { data, error } = await supabase
    .from('news_events')
    .select('*')
    .eq('year_id', yearId);

  if (error) throw error;
  return data;
}