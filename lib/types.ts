export interface Participant {
  id: string;
  name: string;
  emoji: string;
  answers: [string, string, string]; // 3 respuestas ordenadas
  timestamp: number;
}

export interface ScoreResult {
  participantId: string;
  name: string;
  emoji: string;
  scores: [number, number, number]; // 0-100 para cada respuesta
  totalScore: number;
  highestScore: number;
  answers: [string, string, string];
}

export interface AppState {
  revealed: boolean;
  correctAnswer: string;
  revealedAt: number;
}
