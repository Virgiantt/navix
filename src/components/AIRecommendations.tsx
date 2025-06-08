// components/AIRecommendations.tsx
'use client';
import { useEffect, useState } from 'react';
import { Project } from '@/sanity/schemaTypes/ProjectType';
import Image from 'next/image';
import Link from 'next/link';


// Simple Skeleton component for loading placeholders
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-busy="true"
      aria-label="Loading"
    />
  );
}

export default function AIRecommendations({ projectId }: { projectId: string }) {
  const [recommendations, setRecs] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId }),
          signal: controller.signal
        });

        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setRecs(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError('Failed to load recommendations');
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    // Delay fetch to prioritize main content
    const timer = setTimeout(fetchData, 500);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [projectId]);

  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;
  if (!recommendations.length && !loading) return null;

  return (
    <div className="mt-16 border-t pt-12">
      <h3 className="text-2xl font-bold mb-8 flex items-center">
        AI Recommendations
        <span className="ml-3 text-xs bg-blue-100 text-lochmara-400 px-2 py-1 rounded-full">
          Beta
        </span>
      </h3>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((project) => (
            <Link
              key={project._id}
              href={`/projects/${typeof project.slug === 'string' ? project.slug : (project.slug?.current ?? '')}`}
              className="group block transition-transform hover:scale-[1.02]"
            >
              <div className="border rounded-lg overflow-hidden h-full flex flex-col">
                {typeof project.firstImage === 'string' && project.firstImage ? (
                  <div className="relative h-48">
                  <Image
    src={project.firstImage}
    alt={project.title}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 33vw"
  />
                  </div>
                ) : (
                  <div className="bg-gray-100 border-2 border-dashed h-48 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <div className="p-4 flex-grow">
                  <h4 className="font-bold text-lg mb-1 group-hover:text-lochmara-600 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}