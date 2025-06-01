// app/api/recommendations/route.ts
import { getSimilarProjects } from '@/lib/ai/recommendationService';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Bypass cache

export async function POST(req: Request) {
  const { projectId } = await req.json();
  
  // Validate input
  if (!projectId || typeof projectId !== 'string') {
    return NextResponse.json(
      { error: 'Invalid project ID' },
      { status: 400 }
    );
  }

  try {
    const results = await getSimilarProjects(projectId);
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}