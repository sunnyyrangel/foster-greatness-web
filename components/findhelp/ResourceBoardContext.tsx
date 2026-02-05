'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { SavedProgram } from '@/lib/findhelp';

const STORAGE_KEY = 'fg-resource-board';

interface ResourceBoardContextType {
  savedPrograms: SavedProgram[];
  addToBoard: (program: SavedProgram) => void;
  removeFromBoard: (programId: string) => void;
  clearBoard: () => void;
  isInBoard: (programId: string) => boolean;
}

const ResourceBoardContext = createContext<ResourceBoardContextType | undefined>(undefined);

export function ResourceBoardProvider({ children }: { children: ReactNode }) {
  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedPrograms(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load resource board from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever savedPrograms changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPrograms));
      } catch (error) {
        console.error('Failed to save resource board to localStorage:', error);
      }
    }
  }, [savedPrograms, isHydrated]);

  const addToBoard = useCallback((program: SavedProgram) => {
    setSavedPrograms((prev) => {
      // Don't add if already exists
      if (prev.some((p) => p.id === program.id)) {
        return prev;
      }
      return [...prev, { ...program, savedAt: Date.now() }];
    });
  }, []);

  const removeFromBoard = useCallback((programId: string) => {
    setSavedPrograms((prev) => prev.filter((p) => p.id !== programId));
  }, []);

  const clearBoard = useCallback(() => {
    setSavedPrograms([]);
  }, []);

  const isInBoard = useCallback(
    (programId: string) => savedPrograms.some((p) => p.id === programId),
    [savedPrograms]
  );

  return (
    <ResourceBoardContext.Provider
      value={{
        savedPrograms,
        addToBoard,
        removeFromBoard,
        clearBoard,
        isInBoard,
      }}
    >
      {children}
    </ResourceBoardContext.Provider>
  );
}

export function useResourceBoard() {
  const context = useContext(ResourceBoardContext);
  if (context === undefined) {
    throw new Error('useResourceBoard must be used within a ResourceBoardProvider');
  }
  return context;
}
