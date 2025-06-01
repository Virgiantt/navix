// services/projectService.ts

import { client } from "@/sanity/lib/client";
import { Project } from "@/sanity/schemaTypes/ProjectType";
import { groq } from "next-sanity";



export const fetchProjects = async (): Promise<Project[]> => {
  const query = `*[_type == "project"] {
    _id,
    _type,
    title,
    "slug": slug.current,
    client->{
      name,
      "slug": slug.current,
      logo {
        asset->{
          url
        },
        alt
      }
    },
    categories,
    format,
    timeline,
    description,
    content[] {
      _type,
      // Video Block
      _type == "videoBlock" => {
        url,
        orientation,
        caption
      },
      // Gallery Block
      _type == "galleryBlock" => {
        "images": images[] {
          asset->{
            url
          },
          alt
        },
        layout
      },
      // Metrics Block
      _type == "metricsBlock" => {
        title,
        "metrics": metrics[] {
          label,
          value
        }
      },
      // UI Block
      _type == "uiBlock" => {
        "screens": screens[] {
          asset->{
            url
          },
          alt
        },
        prototype
      },
      // Brand Block
      _type == "brandBlock" => {
        "assets": assets[] {
          asset->{
            url
          },
          alt
        },
        styleGuide
      }
    }
  }`;

  return await client.fetch<Project[]>(query);
};

export const fetchProjectBySlug = async (slug: string): Promise<Project> => {
  const query = `*[_type == "project" && slug.current == $slug][0] {
    ...,
    client->{
      ...,
      "slug": slug.current,
      logo {
        asset->{
          url
        },
        alt
      }
    },
    content[] {
      ...,
      // Resolve image assets for all block types
      _type in ["galleryBlock", "uiBlock", "brandBlock"] => {
        ...,
        images[] {
          ...,
          asset->
        },
        screens[] {
          ...,
          asset->
        },
        assets[] {
          ...,
          asset->
        }
      }
    }
  }`;

  return await client.fetch<Project>(query, { slug });
};


export async function fetchProjectById(
  id: string,
  projectionFields: string[] = []
): Promise<Project | null> {
  const projection = projectionFields.length 
    ? `{ ${projectionFields.join(', ')} }`
    : '';
    
  const query = groq`*[_type == "project" && _id == $id][0]${projection}`;
  return client.fetch(query, { id });
}

// Add to getAllProjects (for Pinecone population):
export async function getAllProjectsForEmbedding(): Promise<Project[]> {
  const query = groq`*[_type == "project"]{
    _id,
    title,
    description,
    categories,
    "clientName": client->name,
    "firstImage": ${getFirstImageGroqQuery()}
  }`;
  return client.fetch(query);
}

// Helper for first image query
function getFirstImageGroqQuery() {
  return `coalesce(
    content[_type == "galleryBlock"][0].images[0],
    content[_type == "uiBlock"][0].screens[0],
    content[_type == "brandBlock"][0].assets[0],
    null
  )`;
}