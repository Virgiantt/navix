import 'dotenv/config';
import { getPineconeIndex } from '@/lib/pinecone';
import { getAllProjectsForEmbedding } from '@/services/projectService';
import OpenAI from 'openai';

export async function upsertAllProjects() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const index = getPineconeIndex();
  const projects = await getAllProjectsForEmbedding();

  // Batch upserts for efficiency (max 1000 per batch, but keep it small for now)
  for (const project of projects) {
    const text = `${project.title}\n${project.description}`;
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    const embedding = embeddingRes.data[0].embedding;

    // Upsert the vector
    await index.upsert([
      {
        id: project._id,
        values: embedding,
        metadata: {
          projectId: project._id,
          title: project.title,
          description: project.description,
          slug: project.slug,
        },
      },
    ]);
    console.log(`Upserted project: ${project.title}`);
  }
  console.log('All projects upserted to Pinecone!');
}

// If you want to run this directly with tsx or ts-node:
if (require.main === module) {
  upsertAllProjects().catch(console.error);
} 