'use client';

import { useState, useEffect, useCallback } from 'react';
import { List, Map, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import type { ServiceTag, ProgramLite } from '@/lib/findhelp';
import { ResourceBoardProvider, useResourceBoard } from './ResourceBoardContext';
import ResourceBoard from './ResourceBoard';
import ZipCodeInput from './ZipCodeInput';
import ServiceTagSelector from './ServiceTagSelector';
import ProgramCard from './ProgramCard';
import ProgramDetailModal from './ProgramDetailModal';
import ProgramMap from './ProgramMap';

type ViewMode = 'list' | 'map';
type SearchStep = 'zip' | 'category' | 'results';

interface ProgramSearchInnerProps {
  initialZip?: string;
  initialProgramId?: string;
}

function ProgramSearchInner({ initialZip, initialProgramId }: ProgramSearchInnerProps) {
  // State
  const [step, setStep] = useState<SearchStep>(initialZip ? 'category' : 'zip');
  const [zip, setZip] = useState(initialZip || '');
  const [tags, setTags] = useState<ServiceTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedTagLabel, setSelectedTagLabel] = useState<string>('');
  const [programs, setPrograms] = useState<ProgramLite[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [boardOpen, setBoardOpen] = useState(false);

  // Loading states
  const [tagsLoading, setTagsLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Error states
  const [tagsError, setTagsError] = useState<string | null>(null);
  const [programsError, setProgramsError] = useState<string | null>(null);

  // Modal state
  const [modalProgramId, setModalProgramId] = useState<string | null>(initialProgramId || null);
  const [modalOpen, setModalOpen] = useState(!!initialProgramId);

  // Resource board
  const { savedPrograms } = useResourceBoard();

  // Fetch service tags for ZIP code
  const fetchTags = useCallback(async (zipCode: string) => {
    setTagsLoading(true);
    setTagsError(null);

    try {
      const response = await fetch(`/api/findhelp/tags?zip=${zipCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load categories');
      }

      setTags(data.data.tags || []);
      setStep('category');
    } catch (error) {
      setTagsError(error instanceof Error ? error.message : 'Failed to load categories');
    } finally {
      setTagsLoading(false);
    }
  }, []);

  // Fetch programs
  const fetchPrograms = useCallback(
    async (tagId: string, cursorValue: number = 0, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setProgramsLoading(true);
      }
      setProgramsError(null);

      try {
        const params = new URLSearchParams({
          zip,
          serviceTag: tagId,
          cursor: cursorValue.toString(),
          limit: '20',
        });

        const response = await fetch(`/api/findhelp/search?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to search programs');
        }

        const newPrograms = data.data.programs || [];
        setTotalCount(data.data.count || 0);
        setCursor(cursorValue + newPrograms.length);

        if (append) {
          setPrograms((prev) => [...prev, ...newPrograms]);
        } else {
          setPrograms(newPrograms);
          setStep('results');
        }
      } catch (error) {
        setProgramsError(error instanceof Error ? error.message : 'Failed to search programs');
      } finally {
        setProgramsLoading(false);
        setLoadingMore(false);
      }
    },
    [zip]
  );

  // Handle ZIP submission
  const handleZipSubmit = (zipCode: string) => {
    setZip(zipCode);
    setSelectedTag(null);
    setPrograms([]);
    fetchTags(zipCode);
  };

  // Handle category selection
  const handleCategorySelect = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    setSelectedTag(tagId);
    setSelectedTagLabel(tag?.label || tagId);
    setCursor(0);
    fetchPrograms(tagId, 0, false);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (selectedTag && !loadingMore) {
      fetchPrograms(selectedTag, cursor, true);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'results') {
      setStep('category');
      setSelectedTag(null);
      setPrograms([]);
    } else if (step === 'category') {
      setStep('zip');
      setTags([]);
    }
  };

  // Handle program click
  const handleProgramClick = (programId: string) => {
    setModalProgramId(programId);
    setModalOpen(true);

    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set('program', programId);
    url.searchParams.set('zip', zip);
    window.history.pushState({}, '', url.toString());
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    setModalProgramId(null);

    // Remove program from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('program');
    window.history.pushState({}, '', url.toString());
  };

  // Auto-open modal if initialProgramId provided
  useEffect(() => {
    if (initialProgramId && initialZip) {
      setModalProgramId(initialProgramId);
      setModalOpen(true);
    }
  }, [initialProgramId, initialZip]);

  // Fetch tags if initialZip provided
  useEffect(() => {
    if (initialZip) {
      fetchTags(initialZip);
    }
  }, [initialZip, fetchTags]);

  const hasMore = programs.length < totalCount;

  return (
    <div className="w-full">
      {/* Step indicator and navigation */}
      {step !== 'zip' && (
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-fg-blue hover:text-fg-navy transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>ZIP</span>
            <span>/</span>
            <span className={step === 'category' ? 'font-semibold text-fg-navy' : ''}>Category</span>
            <span>/</span>
            <span className={step === 'results' ? 'font-semibold text-fg-navy' : ''}>Results</span>
          </div>

          {/* Board toggle */}
          <button
            onClick={() => setBoardOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-fg-blue/10 text-fg-blue rounded-full font-medium hover:bg-fg-blue/20 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Saved</span>
            {savedPrograms.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {savedPrograms.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ZIP Code Entry */}
      {step === 'zip' && (
        <div className="py-8">
          <ZipCodeInput onSubmit={handleZipSubmit} isLoading={tagsLoading} />
          {tagsError && (
            <p className="mt-4 text-center text-red-600">{tagsError}</p>
          )}
        </div>
      )}

      {/* Category Selection */}
      {step === 'category' && (
        <div className="py-4">
          <div className="text-center mb-6">
            <p className="text-gray-500">
              Searching in <span className="font-semibold text-fg-navy">{zip}</span>
              <button
                onClick={() => setStep('zip')}
                className="ml-2 text-fg-blue hover:underline"
              >
                Change
              </button>
            </p>
          </div>

          <ServiceTagSelector
            tags={tags}
            selectedTag={selectedTag}
            onSelect={handleCategorySelect}
            isLoading={tagsLoading}
          />

          {tagsError && (
            <p className="mt-4 text-center text-red-600">{tagsError}</p>
          )}
        </div>
      )}

      {/* Results */}
      {step === 'results' && (
        <div>
          {/* Results header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-fg-navy">
                {selectedTagLabel} in {zip}
              </h2>
              <p className="text-gray-500">
                {totalCount} {totalCount === 1 ? 'program' : 'programs'} found
              </p>
            </div>

            {/* View toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-fg-navy shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-fg-navy shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
            </div>
          </div>

          {/* Loading state */}
          {programsLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fg-blue mx-auto mb-3" />
                <p className="text-gray-500">Finding programs...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {programsError && !programsLoading && (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{programsError}</p>
              <button
                onClick={() => selectedTag && fetchPrograms(selectedTag, 0, false)}
                className="px-4 py-2 bg-fg-blue text-white rounded-lg hover:bg-fg-navy transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!programsLoading && !programsError && programs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">No programs found in this category.</p>
              <button
                onClick={() => setStep('category')}
                className="px-4 py-2 bg-fg-blue text-white rounded-lg hover:bg-fg-navy transition-colors"
              >
                Try a different category
              </button>
            </div>
          )}

          {/* Results view */}
          {!programsLoading && !programsError && programs.length > 0 && (
            <>
              {viewMode === 'list' ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {programs.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      onClick={() => handleProgramClick(program.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-gray-200">
                  <ProgramMap
                    programs={programs}
                    onProgramSelect={handleProgramClick}
                    selectedProgramId={modalProgramId}
                  />
                </div>
              )}

              {/* Load more */}
              {viewMode === 'list' && hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-fg-navy text-white rounded-xl font-semibold hover:bg-fg-blue disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      `Load more (${programs.length} of ${totalCount})`
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Floating board button (when not in header) */}
      {step === 'zip' && savedPrograms.length > 0 && (
        <button
          onClick={() => setBoardOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-fg-navy text-white rounded-full font-semibold shadow-lg hover:bg-fg-blue transition-colors z-30"
        >
          <Heart className="w-5 h-5 fill-current" />
          View Saved ({savedPrograms.length})
        </button>
      )}

      {/* Resource Board Panel */}
      <ResourceBoard isOpen={boardOpen} onClose={() => setBoardOpen(false)} />

      {/* Program Detail Modal */}
      <ProgramDetailModal
        programId={modalProgramId || ''}
        zip={zip}
        isOpen={modalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}

// Main export wraps with provider
interface ProgramSearchProps {
  initialZip?: string;
  initialProgramId?: string;
}

export default function ProgramSearch({ initialZip, initialProgramId }: ProgramSearchProps) {
  return (
    <ResourceBoardProvider>
      <ProgramSearchInner initialZip={initialZip} initialProgramId={initialProgramId} />
    </ResourceBoardProvider>
  );
}
