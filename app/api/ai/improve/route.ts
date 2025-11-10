import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Missing text parameter' },
        { status: 400 }
      );
    }

    // Call FastAPI improve endpoint
    const response = await fetch(`${FASTAPI_URL}/api/improve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      improved_text: data.improved_text || data.result || text,
    });
  } catch (error) {
    console.error('FastAPI error:', error);
    return NextResponse.json(
      { error: 'Failed to improve text' },
      { status: 500 }
    );
  }
}

