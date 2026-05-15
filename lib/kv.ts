import { kv } from '@vercel/kv';
import type { Participant, AppState } from './types';

const PARTICIPANTS_KEY = 'prode:participants';
const STATE_KEY = 'prode:state';

export async function saveParticipant(participant: Participant): Promise<void> {
  try {
    const participants = (await kv.get<Participant[]>(PARTICIPANTS_KEY)) || [];
    
    // Actualizar si existe, agregar si no
    const index = participants.findIndex(p => p.id === participant.id);
    if (index >= 0) {
      participants[index] = participant;
    } else {
      participants.push(participant);
    }
    
    await kv.set(PARTICIPANTS_KEY, participants);
  } catch (error) {
    console.error('Error saving participant:', error);
    throw error;
  }
}

export async function getParticipants(): Promise<Participant[]> {
  try {
    const participants = (await kv.get<Participant[]>(PARTICIPANTS_KEY)) || [];
    return participants;
  } catch (error) {
    console.error('Error getting participants:', error);
    return [];
  }
}

export async function getParticipant(id: string): Promise<Participant | null> {
  try {
    const participants = (await kv.get<Participant[]>(PARTICIPANTS_KEY)) || [];
    return participants.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error getting participant:', error);
    return null;
  }
}

export async function getAppState(): Promise<AppState> {
  try {
    const state = (await kv.get<AppState>(STATE_KEY)) || {
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
    const state: AppState = {
      revealed: true,
      correctAnswer,
      revealedAt: Date.now(),
    };
    await kv.set(STATE_KEY, state);
  } catch (error) {
    console.error('Error revealing answer:', error);
    throw error;
  }
}

export async function resetApp(): Promise<void> {
  try {
    await kv.del(PARTICIPANTS_KEY);
    await kv.del(STATE_KEY);
  } catch (error) {
    console.error('Error resetting app:', error);
    throw error;
  }
}
