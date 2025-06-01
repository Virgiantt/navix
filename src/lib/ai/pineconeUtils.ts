// Deprecated: Pinecone utilities removed as part of reverting to pre-RAG state.

/* eslint-disable @typescript-eslint/no-explicit-any */
import { index } from '@/lib/pinecone';
import OpenAI from 'openai';
import type { Project } from '@/sanity/schemaTypes/ProjectType';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Upsert a single project into Pinecone (for real-time updates)
 * @param {Project} project - Project object from Sanity
 */
export async function upsertProjectToPinecone(project: Project) {
  try {
    const text = `
      Project: ${project.title}
      Description: ${project.description}
      Categories: ${project.categories?.join(', ') || ''}
      Client: ${project.client?.name || (project as any).clientName || ''}
    `.trim();

    const embedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    await index.upsert([
      {
        id: project._id,
        values: embedding.data[0].embedding,
        metadata: {
          projectId: project._id, // Always include for filtering
          title: project.title,
          description: project.description,
          categories: project.categories,
          slug: project.slug.current,
          featuredImage: (project as any).featuredImage || (project as any).firstImage,
        },
      },
    ]);
  } catch (error) {
    console.error('Pinecone upsert error:', error);
    throw error;
  }
}

/**
 * Delete a project from Pinecone by projectId
 * @param {string} projectId
 */
export async function deleteProjectFromPinecone(projectId: string) {
  try {
    await index.deleteOne(projectId);
  } catch (error) {
    console.error('Pinecone delete error:', error);
    throw error;
  }
} 