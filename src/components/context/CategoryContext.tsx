// context/CategoryContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { fetchCategories } from '@/services/categoryService';
import { Category } from '@/sanity/schemaTypes/categoryType';

interface CategoryContextProps {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
}

const CategoryContext = createContext<CategoryContextProps>({
  categories: [],
  isLoading: true,
  error: null,
});

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, isLoading, error }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);