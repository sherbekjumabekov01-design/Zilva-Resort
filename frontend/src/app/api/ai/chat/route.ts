import { NextRequest, NextResponse } from 'next/server';
import { processAiConciergeQuery } from '@/lib/ai-assistant';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, lang = 'UZ' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const response = processAiConciergeQuery(message, lang);
    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
