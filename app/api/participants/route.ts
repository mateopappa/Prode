import { NextRequest, NextResponse } from 'next/server';
import { saveParticipant, getParticipants, getAppState } from '@/lib/kv';
import { generateId } from '@/lib/utils';

function blurAnswer(answer: string): string {
  const length = Math.min(Math.max(answer.length, 3), 24);
  return '•'.repeat(length);
}

export async function GET(request: NextRequest) {
  try {
    const participants = await getParticipants();
    const state = await getAppState();

    // Ocultar respuestas si el juego no está revelado
    if (!state.revealed) {
      return NextResponse.json({
        participants: participants.map(p => ({
          ...p,
          answers: p.answers.map(blurAnswer) as [string, string, string],
        })),
        count: participants.length,
      });
    }

    return NextResponse.json({
      participants,
      count: participants.length,
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, emoji, answers } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const id = generateId();
    const answerArray = Array.isArray(answers) && answers.length === 3 
      ? [answers[0]?.trim() || '', answers[1]?.trim() || '', answers[2]?.trim() || '']
      : ['', '', ''];

    const participant = {
      id,
      name: name.trim(),
      emoji: emoji || '🎯',
      answers: answerArray as [string, string, string],
      timestamp: Date.now(),
    };

    await saveParticipant(participant);

    return NextResponse.json({
      success: true,
      id,
      participant,
    });
  } catch (error) {
    console.error('Error saving participant:', error);
    return NextResponse.json(
      { error: 'Failed to save participant' },
      { status: 500 }
    );
  }
}
