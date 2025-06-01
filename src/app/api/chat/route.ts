import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY');
      return Response.json({ reply: 'AI is not configured. Please contact the agency.' }, { status: 200 });
    }

    // Compose system prompt
    const systemPrompt = `You are an agency project advisor. Answer the user's question about our agency, services, and projects.`;

    // Call OpenAI chat API
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...((history || []).map((m: ChatMessage) => ({ role: m.role, content: m.content })) || []),
          { role: 'user', content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });
    if (!res.ok) {
      const errorBody = await res.text();
      let userMessage = `AI service error: ${res.status}`;
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed?.error?.code === 'insufficient_quota') {
          userMessage = 'Our AI assistant is temporarily unavailable due to usage limits. Please try again later or contact us directly.';
        } else if (parsed?.error?.message) {
          userMessage = parsed.error.message;
        }
      } catch {}
      console.error('OpenAI API error:', res.status, errorBody);
      return Response.json({ reply: userMessage }, { status: 500 });
    }
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';
    return Response.json({ reply });
  } catch (err) {
    console.error('API /api/chat error:', err);
    return Response.json({ reply: `Sorry, something went wrong. ${err instanceof Error ? err.message : ''}` }, { status: 500 });
  }
} 