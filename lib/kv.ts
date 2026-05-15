import type { Participant, AppState } from './types';

const PARTICIPANTS_KEY = 'prode:participants';
const STATE_KEY = 'prode:state';

type KeyValueClient = {
  get: (k: string) => Promise<any>;
  set: (k: string, v: any) => Promise<any>;
  del: (k: string) => Promise<any>;
};

let cachedClient: KeyValueClient | null = null;

async function getClient(): Promise<KeyValueClient> {
  if (cachedClient) return cachedClient;

  const hasVercelKV = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

  if (hasVercelKV) {
    const mod = await import('@vercel/kv');
    cachedClient = {
      get: async (k: string) => await mod.kv.get(k),
      set: async (k: string, v: any) => await mod.kv.set(k, v),
      del: async (k: string) => await mod.kv.del(k),
    };
    return cachedClient;
  }

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (upstashUrl && upstashToken) {
    const { Redis } = await import('@upstash/redis');
    const client = new Redis({ url: upstashUrl, token: upstashToken });

    cachedClient = {
      get: async (k: string) => {
        const res = await client.get(k);
        if (res == null) return null;
        if (typeof res === 'string') {
          try { return JSON.parse(res); } catch { return res; }
        }
        return res;
      },
      set: async (k: string, v: any) => {
        const val = typeof v === 'string' ? v : JSON.stringify(v);
        return client.set(k, val);
      },
      del: async (k: string) => client.del(k),
    };

    return cachedClient;
  }

  const store = new Map<string, any>();
  cachedClient = {
    get: async (k: string) => store.has(k) ? store.get(k) : null,
    set: async (k: string, v: any) => { store.set(k, v); return null; },
    del: async (k: string) => { store.delete(k); return null; },
  };

  return cachedClient;
}

export async function saveParticipant(participant: Participant): Promise<void> {
  try {
    const client = await getClient();
    const participants: Participant[] = (await client.get(PARTICIPANTS_KEY)) || [];
    const index = participants.findIndex(p => p.id === participant.id);
    if (index >= 0) participants[index] = participant;
    else participants.push(participant);
    await client.set(PARTICIPANTS_KEY, participants);
  } catch (error) {
    console.error('Error saving participant:', error);
    throw error;
  }
}

export async function getParticipants(): Promise<Participant[]> {
  try {
    const client = await getClient();
    const participants: Participant[] = (await client.get(PARTICIPANTS_KEY)) || [];
    return participants;
  } catch (error) {
    console.error('Error getting participants:', error);
    return [];
  }
}

export async function getParticipant(id: string): Promise<Participant | null> {
  try {
    const client = await getClient();
    const participants: Participant[] = (await client.get(PARTICIPANTS_KEY)) || [];
    return participants.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error getting participant:', error);
    return null;
  }
}

export async function getAppState(): Promise<AppState> {
  try {
    const client = await getClient();
    const state: AppState = (await client.get(STATE_KEY)) || {
      revealed: false,
      correctAnswer: '',
      revealedAt: 0,
    };
    return state;
  } catch (error) {
    console.error('Error getting app state:', error);
    return {
      revealed: false,
      correctAnswer: '',
      revealedAt: 0,
    };
  }
}

export async function revealAnswer(correctAnswer: string): Promise<void> {
  try {
    const client = await getClient();
    const state: AppState = {
      revealed: true,
      correctAnswer,
      revealedAt: Date.now(),
    };
    await client.set(STATE_KEY, state);
  } catch (error) {
    console.error('Error revealing answer:', error);
    throw error;
  }
}

export async function resetApp(): Promise<void> {
  try {
    const client = await getClient();
    await client.del(PARTICIPANTS_KEY);
    await client.del(STATE_KEY);
  } catch (error) {
    console.error('Error resetting app:', error);
    throw error;
  }
}

export async function removeParticipant(id: string): Promise<void> {
  try {
    const client = await getClient();
    const participants: any[] = (await client.get(PARTICIPANTS_KEY)) || [];
    const filtered = participants.filter(p => p.id !== id);
    await client.set(PARTICIPANTS_KEY, filtered);
  } catch (error) {
    console.error('Error removing participant:', error);
    throw error;
  }
}
