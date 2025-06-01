import 'dotenv/config';
import { getPineconeIndex } from '@/lib/pinecone';
import { getAllProjectsForEmbedding } from '@/services/projectService';
import OpenAI from 'openai';

export async function upsertAllProjects() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const index = getPineconeIndex();
  const projects = await getAllProjectsForEmbedding();

  for (const project of projects) {
    const text = `${project.title}\n${project.description}`;
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    const embedding = embeddingRes.data[0].embedding;

    // Build a content summary from all string fields in content
    let contentSummary = '';
    if (Array.isArray(project.content)) {
      contentSummary = project.content
        .map(block => {
          if (typeof block === 'string') return block;
          return Object.values(block)
            .filter(v => typeof v === 'string')
            .join(' ');
        })
        .join(' ')
        .slice(0, 500);
    }

    // Ensure firstImage is always a string (URL or empty)
    let firstImage = '';
    if (typeof project.firstImage === 'string') {
      firstImage = project.firstImage;
    } else if (project.firstImage && typeof project.firstImage === 'object' && project.firstImage.asset && typeof project.firstImage.asset.url === 'string') {
      firstImage = project.firstImage.asset.url;
    }

    await index.upsert([
      {
        id: project._id,
        values: embedding,
        metadata: {
          projectId: project._id,
          title: project.title,
          description: project.description,
          categories: project.categories,
          slug: project.slug?.current ?? project.slug ?? '',
          client: project.clientName ?? project.client?.name ?? '',
          firstImage,
          contentSummary,
        },
      },
    ]);
    console.log(`Upserted project: ${project.title}`);
  }
  console.log('All projects upserted to Pinecone!');
}

if (require.main === module) {
  upsertAllProjects().catch(console.error);
}