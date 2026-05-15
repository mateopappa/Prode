import { NextRequest, NextResponse } from 'next/server';
import { getParticipants, getAppState } from '@/lib/kv';
import { calculateParticipantScores } from '@/lib/similarity';
import type { ScoreResult } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const state = await getAppState();

    if (!state.revealed) {
      return NextResponse.json(
        { error: 'Answer not revealed yet' },
        { status: 403 }
      );
    }

    const participants = await getParticipants();

    const scores: ScoreResult[] = participants.map(p => {
      const scores = calculateParticipantScores(p.answers, state.correctAnswer);
      const highestScore = Math.max(...scores);

      return {
        participantId: p.id,
        name: p.name,
        emoji: p.emoji,
        scores: scores as [number, number, number],
        totalScore: scores.reduce((a, b) => a + b, 0),
        highestScore,
        answers: p.answers,
      };
    });

    // Ordenar por highest score (descendente)
    scores.sort((a, b) => {
      if (b.highestScore !== a.highestScore) {
        return b.highestScore - a.highestScore;
      }
      // Desempate por total
      return b.totalScore - a.totalScore;
    });

    return NextResponse.json({
      correctAnswer: state.correctAnswer,
      scores,
      revealedAt: state.revealedAt,
    });
  } catch (error) {
    console.error('Error calculating scores:', error);
    return NextResponse.json(
      { error: 'Failed to calculate scores' },
      { status: 500 }
    );
  }
}
