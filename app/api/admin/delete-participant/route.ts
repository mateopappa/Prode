import { NextRequest, NextResponse } from 'next/server';
import { removeParticipant } from '@/lib/kv';

export async function POST(request: NextRequest) {
  try {
    const { id, password } = await request.json();

    if (!id || !password) {
      return NextResponse.json({ error: 'Missing id or password' }, { status: 400 });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    await removeParticipant(id);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json({ error: 'Failed to delete participant' }, { status: 500 });
  }
}
