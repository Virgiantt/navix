// services/clientService.ts

import { client } from "@/sanity/lib/client";
import { Client } from "@/sanity/schemaTypes/clientType";

// services/clientService.ts
export const fetchClients = async (): Promise<Client[]> => {
    const query = `*[_type == "client"] {
      _id,
      name,
      "slug": slug.current,
      "logo": {
        "asset": {
          "url": logo.asset->url
        },
        "alt": logo.alt
      },
      description,
      "category": category->title,
      website,
      testimonial,
      featured,
      representative {
        name,
        role,
        "image": {
          "asset": {
            "url": image.asset->url
          },
          "alt": image.alt
        }
      },
      social {
        linkedin,
        twitter
      }
    }`;
    
    return await client.fetch<Client[]>(query);
  };