// services/categoryService.ts

import { client } from "@/sanity/lib/client";
import { Category } from "@/sanity/schemaTypes/categoryType";


export const fetchCategories = async (): Promise<Category[]> => {
  const query = `*[_type == "category"] {
    _id,
    title,
    "slug": slug.current,
    description
  }`;
  
  return await client.fetch<Category[]>(query);
};