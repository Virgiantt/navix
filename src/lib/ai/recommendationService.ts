// lib/ai/recommendationService.ts
import { index } from '@/lib/pinecone';
import { Project } from '@/sanity/schemaTypes/ProjectType';
import { fetchProjectById } from '@/services/projectService';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Cache embeddings to reduce API calls
const embeddingCache = new Map<string, number[]>();

export const getSimilarProjects = async (projectId: string): Promise<Project[]> => {
  try {
    // 1. Fetch project data from Sanity
    const project = await fetchProjectById(projectId);
    if (!project) return [];
    
    // 2. Generate or retrieve cached embedding
    let embedding: number[];
    if (embeddingCache.has(projectId)) {
      embedding = embeddingCache.get(projectId)!;
    } else {
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: generateEmbeddingText(project)
      });
      embedding = embeddingResponse.data[0].embedding;
      embeddingCache.set(projectId, embedding);
    }

    // 3. Query Pinecone with optimized parameters
    const results = await index.query({
      vector: embedding,
      topK: 4, // Get 4 to filter out current project
      includeMetadata: true,
      filter: { projectId: { "$ne": projectId } } // Exclude current project
    });

    // 4. Process results with safety checks
    return results.matches
      .filter(match => match.score && match.score > 0.7 && match.metadata) // Minimum similarity threshold and metadata existence
      .map(match => match.metadata as unknown as Project)
      .slice(0, 3); // Return top 3
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
};

// Helper to generate consistent embedding text
const generateEmbeddingText = (project: Project): string => {
  return `
    Project: ${project.title}
    Description: ${project.description}
    Categories: ${project.categories.join(', ')}
    Client: ${project.client?.name || ''}
    Format: ${project.format || ''}
    Timeline: ${project.timeline || ''}
  `.trim();
};

// Fetch project from Sanity (optimized query)
