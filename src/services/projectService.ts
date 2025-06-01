// services/projectService.ts

import { client } from "@/sanity/lib/client";
import { Project } from "@/sanity/schemaTypes/ProjectType";



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

//fetch project by id
export const fetchProjectById = async (id: string): Promise<Project> => {
  const query = `*[_type == "project" && _id == $id][0] {
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

  return await client.fetch<Project>(query, { id });
}