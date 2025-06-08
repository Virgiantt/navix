import 'dotenv/config';
import { getPineconeIndex } from '@/lib/pinecone';
import { getAllProjectsForEmbedding } from '@/services/projectService';
import { fetchClients } from '@/services/clientService';
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
        id: `project_${project._id}`, // Prefix to distinguish from clients
        values: embedding,
        metadata: {
          type: 'project', // Add type for filtering
          projectId: project._id,
          title: project.title,
          description: project.description,
          categories: project.categories,
          slug: project.slug?.current ?? project.slug ?? '',
          clientName: project.clientName ?? project.client?.name ?? '',
          firstImage,
          contentSummary,
        },
      },
    ]);
    console.log(`✅ Upserted project: ${project.title}`);
  }
  console.log('🎯 All projects upserted to Pinecone!');
}

// 🔥 NEW: Function to upsert all clients to Pinecone
export async function upsertAllClients() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const index = getPineconeIndex();
  const clients = await fetchClients();

  for (const client of clients) {
    // Create rich text for embedding that includes all client info
    const clientText = `${client.name}
${client.description || ''}
${client.category || ''}
${client.testimonial || ''}
${client.representative?.name || ''} ${client.representative?.role || ''}
${client.website || ''}`;

    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: clientText,
    });
    const embedding = embeddingRes.data[0].embedding;

    // Ensure logo URL is properly extracted
    let logoUrl = '';
    if (typeof client.logo?.asset?.url === 'string') {
      logoUrl = client.logo.asset.url;
    }

    // Ensure representative image URL is properly extracted
    let representativeImageUrl = '';
    if (typeof client.representative?.image?.asset?.url === 'string') {
      representativeImageUrl = client.representative.image.asset.url;
    }

    await index.upsert([
      {
        id: `client_${client._id}`, // Prefix to distinguish from projects
        values: embedding,
        metadata: {
          type: 'client', // Add type for filtering
          clientId: client._id,
          name: client.name,
          description: client.description || '',
          category: client.category || '',
          website: client.website || '',
          testimonial: client.testimonial || '',
          featured: client.featured || false,
          slug: client.slug || '',
          logoUrl,
          representativeName: client.representative?.name || '',
          representativeRole: client.representative?.role || '',
          representativeImageUrl,
          linkedin: client.social?.linkedin || '',
          twitter: client.social?.twitter || '',
        },
      },
    ]);
    console.log(`✅ Upserted client: ${client.name}`);
  }
  console.log('🎯 All clients upserted to Pinecone!');
}

// 🚀 Enhanced function to upsert BOTH projects and clients
export async function upsertAllData() {
  console.log('🔥 Starting comprehensive Pinecone upsert...\n');
  
  console.log('📁 Upserting projects...');
  await upsertAllProjects();
  
  console.log('\n👥 Upserting clients...');
  await upsertAllClients();
  
  console.log('\n🎉 BOOM! All projects AND clients are now in Pinecone!');
  console.log('🧠 Navi is now SUPER SMART about your entire business ecosystem!');
}

if (require.main === module) {
  upsertAllData().catch(console.error);
}