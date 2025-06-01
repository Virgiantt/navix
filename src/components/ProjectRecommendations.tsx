// components/ProjectRecommendations.tsx
'use client';
import { useEffect, useState } from 'react';
import { Project } from '@/sanity/schemaTypes/ProjectType';
import { fetchProjects } from '@/services/projectService';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

// Simple ProjectCard fallback if not found elsewhere
function ProjectCard({ project }: { project: Project; compact?: boolean }) {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="bg-gray-100 h-40 flex items-center justify-center">
        {/* Optionally show image if available */}
        {project.featuredImage ? (
          <Image
            src={urlFor(project.featuredImage).url()}
            alt={project.title}
            className="object-cover w-full h-full"
            fill
            sizes="100vw"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <div className="p-4 flex-grow">
        <h4 className="font-bold text-lg mb-1">{project.title}</h4>
        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
      </div>
    </div>
  );
}

export default function ProjectRecommendations() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all projects and take the first 3 as featured
        const data = await fetchProjects();
        setProjects(data.slice(0, 3));
      } catch (error) {
        setError('Failed to load projects');
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;
  if (!projects.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {projects.map(project => (
        <ProjectCard 
          key={project._id} 
          project={project} 
          compact={true}
        />
      ))}
    </div>
  );
}