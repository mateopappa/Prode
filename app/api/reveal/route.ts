import { NextRequest, NextResponse } from 'next/server';
import { revealAnswer, getAppState } from '@/lib/kv';

export async function POST(request: NextRequest) {
  try {
    const { password, answer } = await request.json();

    // Verificar contraseña (en producción usar variable de entorno)
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    if (!answer || typeof answer !== 'string') {
      return NextResponse.json(
        { error: 'Answer required' },
        { status: 400 }
      );
    }

    await revealAnswer(answer.trim());

    return NextResponse.json({
      success: true,
      message: 'Answer revealed',
    });
  } catch (error) {
    console.error('Error revealing answer:', error);
    return NextResponse.json(
      { error: 'Failed to reveal answer' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { password } = Object.fromEntries(request.nextUrl.searchParams);

    // Verificar contraseña
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const state = await getAppState();

    return NextResponse.json({
      revealed: state.revealed,
      correctAnswer: state.correctAnswer,
      revealedAt: state.revealedAt,
    });
  } catch (error) {
    console.error('Error getting state:', error);
    return NextResponse.json(
      { error: 'Failed to get state' },
      { status: 500 }
    );
  }
}
