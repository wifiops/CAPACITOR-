import { NextRequest, NextResponse } from 'next/server';
import { capacitorAI } from '@/lib/ai';

// FastAPI backend URL - configure this in your environment
const FASTAPI_URL = process.env.FASTAPI_URL || process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, text } = body;

    if (!action || !text) {
      return NextResponse.json(
        { error: 'Missing action or text parameter' },
        { status: 400 }
      );
    }

    // Try to call FastAPI backend first
    try {
      const response = await fetch(`${FASTAPI_URL}/api/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          result: data.improved_text || data.result || data.text || text,
          source: 'fastapi',
        });
      }
    } catch (error) {
      console.log('FastAPI not available, using local fallback:', error);
    }

    // Fallback to local AI processing if FastAPI is unavailable
    const result = await capacitorAI.callAI(action, text);
    return NextResponse.json({
      result,
      source: 'local',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

