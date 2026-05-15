import { NextRequest, NextResponse } from 'next/server';
import { resetApp } from '@/lib/kv';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Verificar contraseña
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    await resetApp();

    return NextResponse.json({
      success: true,
      message: 'App reset',
    });
  } catch (error) {
    console.error('Error resetting app:', error);
    return NextResponse.json(
      { error: 'Failed to reset app' },
      { status: 500 }
    );
  }
}
