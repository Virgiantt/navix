// context/DataContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCategories } from '@/services/categoryService';
import { fetchClients } from '@/services/clientService';
import { fetchProjects } from '@/services/projectService';
import { Category } from '@/sanity/schemaTypes/categoryType';
import { Client } from '@/sanity/schemaTypes/clientType';
import { Project } from '@/sanity/schemaTypes/ProjectType';

interface DataContextProps {
  categories: Category[];
  clients: Client[];
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextProps>({
  categories: [],
  clients: [],
  projects: [],
  isLoading: true,
  error: null,
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<Omit<DataContextProps, 'error'>>({
    categories: [],
    clients: [],
    projects: [],
    isLoading: true,
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categories, clients, projects] = await Promise.all([
          fetchCategories(),
          fetchClients(),
          fetchProjects(),
        ]);

        setState({
          categories,
          clients,
          projects,
          isLoading: false,
        });
      } catch (err) {
        setError(err as Error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ ...state, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);