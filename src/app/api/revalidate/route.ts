// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { populateVectorDB } from '@/scripts/populatePinecone';

export async function POST(req: Request) {
  // ... auth validation
  
  try {
    await populateVectorDB();
    revalidateTag('projects');
    return Response.json({ success: true });
  } catch (error) {
    console.error('Revalidation error:', error);
    return Response.json({ success: false }, { status: 500 });
  }
}