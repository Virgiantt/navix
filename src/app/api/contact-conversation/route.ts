import { NextRequest } from 'next/server';

export const runtime = 'edge';

type ConversationMessage = { 
  role: 'user' | 'assistant' | 'system'; 
  content: string; 
};

type ConversationState = {
  category: string;
  questionCount: number;
  isComplete: boolean;
  userResponses: Record<string, string>;
};

export async function POST(req: NextRequest) {
  let conversationState: ConversationState | undefined;
  
  try {
    const { message, history, conversationState: reqConversationState } = await req.json();
    conversationState = reqConversationState;
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY');
      return Response.json({ 
        reply: 'AI is not configured. Please contact us directly at contact@navix.com', 
        conversationState: conversationState,
        isComplete: false 
      }, { status: 200 });
    }

    const state: ConversationState = conversationState || {
      category: '',
      questionCount: 0,
      isComplete: false,
      userResponses: {}
    };

    // Enhanced system prompt for conversational contact form
    const systemPrompt = `You are Navix's AI project consultant. Your job is to guide users through a smart, conversational contact form that feels natural and helpful.

SERVICES AVAILABLE:
- Marketing Strategy: Growth marketing, campaigns, media buying, analytics
- Video Editing: Video production, editing, motion graphics, storytelling
- Development: Web development, full-stack solutions, e-commerce, apps
- UX/UI: User experience design, interface design, prototyping, user research
- Branding: Brand identity, logos, visual systems, brand strategy

CONVERSATION RULES:
1. Ask MAX 6 questions total
2. Questions should be SHORT, friendly, and conversational
3. Adapt questions based on the chosen service and previous answers
4. Each question should gather specific project details
5. Keep responses under 40 words
6. End with a project summary and meeting invitation

QUESTION PROGRESSION EXAMPLE:
For "Development" service:
1. "What type of product are you building?" 
2. "Who's your target audience?"
3. "What's your timeline looking like?"
4. "Any specific features or integrations you need?"
5. "What's your approximate budget range?"
6. "What's the biggest challenge you're facing right now?"

Then create a summary like: "You're planning to build a [product type] for [audience] with [key features]. Timeline: [timeline]. This sounds like an exciting project! Ready to schedule a quick call to discuss the details?"

CURRENT STATE: ${JSON.stringify(state)}

Be conversational, friendly, and focus on getting actionable project details. If this is question 6 or the user seems ready, provide a summary and suggest scheduling a call.`;

    // Build conversation history for context
    const messages: ConversationMessage[] = [
      { role: 'system', content: systemPrompt },
      ...((history || []).map((m: ConversationMessage) => ({ 
        role: m.role, 
        content: m.content 
      })) || []),
      { role: 'user', content: message },
    ];

    // Call OpenAI API
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      let userMessage = `AI service error: ${res.status}`;
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed?.error?.code === 'insufficient_quota') {
          userMessage = 'Our AI assistant is temporarily unavailable. Please contact us directly at contact@navix.com or book a call below.';
        } else if (parsed?.error?.message) {
          userMessage = parsed.error.message;
        }
      } catch {}
      console.error('OpenAI API error:', res.status, errorBody);
      return Response.json({ 
        reply: userMessage, 
        conversationState: state,
        isComplete: false 
      }, { status: 500 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';

    // Update conversation state
    const newState = {
      ...state,
      questionCount: state.questionCount + 1,
      isComplete: state.questionCount >= 5 || reply.toLowerCase().includes('schedule') || reply.toLowerCase().includes('call'),
      userResponses: {
        ...state.userResponses,
        [`question_${state.questionCount + 1}`]: message
      }
    };

    return Response.json({ 
      reply,
      conversationState: newState,
      isComplete: newState.isComplete
    });
  } catch (err) {
    console.error('API /api/contact-conversation error:', err);
    return Response.json({ 
      reply: `Sorry, something went wrong. Please try again or contact us directly.`,
      conversationState: conversationState || {},
      isComplete: false
    }, { status: 500 });
  }
}