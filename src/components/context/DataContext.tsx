// context/DataContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCategories } from '@/services/categoryService';
import { fetchClients } from '@/services/clientService';
import { Category } from '@/sanity/schemaTypes/categoryType';
import { Client } from '@/sanity/schemaTypes/clientType';


interface DataContextProps {
  categories: Category[];
  clients: Client[];
  isLoading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextProps>({
  categories: [],
  clients: [],
  isLoading: true,
  error: null,
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Omit<DataContextProps, 'isLoading' | 'error'>>({
    categories: [],
    clients: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categories, clients] = await Promise.all([
          fetchCategories(),
          fetchClients(),
        ]);

        setData({ categories, clients });
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ ...data, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);