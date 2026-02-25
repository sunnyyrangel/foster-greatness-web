'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { trackEvent } from '@/lib/analytics';
import { List, Map, Heart, ArrowLeft, Loader2, Search, MapPin, ExternalLink } from 'lucide-react';
import type { ServiceTag, ProgramLite } from '@/lib/findhelp';
import type { CommunityResource, InformationalResource } from '@/lib/resources';
import { ResourceBoardProvider, useResourceBoard } from './ResourceBoardContext';
import ResourceBoard from './ResourceBoard';
import ZipCodeInput from './ZipCodeInput';
import ServiceTagSelector, { SDOH_CATEGORIES, groupTagsByCategory } from './ServiceTagSelector';
import ProgramCard from './ProgramCard';
import ProgramDetailModal from './ProgramDetailModal';
import InformationalResourceCard from './InformationalResourceCard';
import ProgramMap from './ProgramMap';

type ViewMode = 'list' | 'map';
type SearchStep = 'zip' | 'category' | 'results';

interface ProgramSearchInnerProps {
  initialZip?: string;
  initialProgramId?: string;
  widget?: boolean;
}

function ProgramSearchInner({ initialZip, initialProgramId, widget }: ProgramSearchInnerProps) {
  // State
  const [step, setStep] = useState<SearchStep>(initialZip ? 'category' : 'zip');
  const [zip, setZip] = useState(initialZip || '');
  const [zipInput, setZipInput] = useState(initialZip || '');
  const [tags, setTags] = useState<ServiceTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedTagLabel, setSelectedTagLabel] = useState<string>('');
  const [programs, setPrograms] = useState<ProgramLite[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [boardOpen, setBoardOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState('');

  // Community resources state
  const [communityResources, setCommunityResources] = useState<CommunityResource[]>([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [modalCommunityResource, setModalCommunityResource] = useState<CommunityResource | null>(null);

  // Informational resources state
  const [informationalResources, setInformationalResources] = useState<InformationalResource[]>([]);
  const [informationalLoading, setInformationalLoading] = useState(false);
  const [informationalExpanded, setInformationalExpanded] = useState(false);

  // Loading states
  const [tagsLoading, setTagsLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Error states
  const [tagsError, setTagsError] = useState<string | null>(null);
  const [programsError, setProgramsError] = useState<string | null>(null);

  // Hover sync state
  const [hoveredProgramId, setHoveredProgramId] = useState<string | null>(null);
  const [hoveredFromMap, setHoveredFromMap] = useState(false);
  const listPanelRef = useRef<HTMLDivElement>(null);

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
    async (tagId: string, cursorValue: number = 0, append: boolean = false, terms?: string) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setProgramsLoading(true);
      }
      setProgramsError(null);

      try {
        const params = new URLSearchParams({
          zip,
          cursor: cursorValue.toString(),
          limit: widget ? '6' : '20',
        });
        if (tagId) params.set('serviceTag', tagId);
        if (terms) params.set('terms', terms);

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

  // Fetch community resources from Supabase
  const fetchCommunityResources = useCallback(async (zipCode: string, categoryLabel: string) => {
    setCommunityLoading(true);
    try {
      const params = new URLSearchParams({ zip: zipCode, category: categoryLabel });
      const response = await fetch(`/api/resources/search?${params}`);
      const data = await response.json();
      if (response.ok && data.data?.resources) {
        setCommunityResources(data.data.resources);
      } else {
        setCommunityResources([]);
      }
    } catch {
      // Silently fail — community resources are supplementary
      setCommunityResources([]);
    } finally {
      setCommunityLoading(false);
    }
  }, []);

  // Fetch informational resources from Supabase
  const fetchInformationalResources = useCallback(async (zipCode: string, categoryLabel: string) => {
    setInformationalLoading(true);
    setInformationalExpanded(false);
    try {
      const params = new URLSearchParams({ category: categoryLabel, zip: zipCode });
      const response = await fetch(`/api/resources/informational?${params}`);
      const data = await response.json();
      if (response.ok && data.data?.resources) {
        setInformationalResources(data.data.resources);
      } else {
        setInformationalResources([]);
      }
    } catch {
      // Silently fail — informational resources are supplementary
      setInformationalResources([]);
    } finally {
      setInformationalLoading(false);
    }
  }, []);

  // Handle ZIP submission
  const handleZipSubmit = (zipCode: string) => {
    setZip(zipCode);
    setZipInput(zipCode);
    setSelectedTag(null);
    setPrograms([]);
    fetchTags(zipCode);
    trackEvent('service_search', { zip: zipCode, channel: widget ? 'embed' : 'web' });
  };

  // Handle category selection
  const handleCategorySelect = (tagIds: string, label: string) => {
    setSelectedTag(tagIds);
    setSelectedTagLabel(label);
    setCursor(0);
    setCommunityResources([]);
    setInformationalResources([]);
    fetchPrograms(tagIds, 0, false);
    fetchCommunityResources(zip, label);
    fetchInformationalResources(zip, label);
    trackEvent('service_category_select', { category: label, zip, channel: widget ? 'embed' : 'web' });
  };

  // Handle load more
  const handleLoadMore = () => {
    if ((selectedTag || searchTerms) && !loadingMore) {
      fetchPrograms(selectedTag || '', cursor, true, searchTerms || undefined);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'results') {
      setStep('category');
      setSelectedTag(null);
      setPrograms([]);
      setCommunityResources([]);
      setInformationalResources([]);
      setModalCommunityResource(null);
    } else if (step === 'category') {
      setStep('zip');
      setTags([]);
    }
  };

  // Handle program click
  const handleProgramClick = (programId: string) => {
    // Check if this is a community resource
    const communityMatch = communityResources.find(r => r.id === programId);
    setModalCommunityResource(communityMatch || null);
    setModalProgramId(programId);
    setModalOpen(true);
    const programMatch = programs.find(p => p.id === programId);
    trackEvent('service_program_view', {
      program_id: programId,
      program_name: communityMatch?.name || programMatch?.name || '',
      source: communityMatch ? 'community' : 'findhelp',
      zip,
      channel: widget ? 'embed' : 'web',
    });

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
    setModalCommunityResource(null);

    // Remove program from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('program');
    window.history.pushState({}, '', url.toString());
  };

  // Handle tag search from modal
  const handleTagSearch = (tagId: string, label: string) => {
    handleModalClose();
    setSelectedTag(tagId);
    setSelectedTagLabel(label);
    setSearchTerms('');
    setCursor(0);
    fetchPrograms(tagId, 0, false);
  };

  // Handle keyword search
  const handleTermsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerms.trim()) return;
    setSelectedTag(null);
    setCursor(0);
    setCommunityResources([]);
    setInformationalResources([]);
    setSelectedTagLabel(`"${searchTerms.trim()}"`);
    fetchPrograms('', 0, false, searchTerms.trim());
    trackEvent('service_keyword_search', { terms: searchTerms.trim(), zip, channel: widget ? 'embed' : 'web' });
  };

  // Handle category switch from results view
  const handleCategorySwitch = (tagIds: string, label: string) => {
    setSelectedTag(tagIds);
    setSelectedTagLabel(label);
    setSearchTerms('');
    setCursor(0);
    setCommunityResources([]);
    setInformationalResources([]);
    fetchPrograms(tagIds, 0, false);
    fetchCommunityResources(zip, label);
    fetchInformationalResources(zip, label);
  };

  // Compute available SDOH categories for the category bar
  const availableCategories = useMemo(() => {
    if (tags.length === 0) return [];
    const grouped = groupTagsByCategory(tags);
    return SDOH_CATEGORIES
      .filter((cat) => {
        const group = grouped.get(cat.id);
        return group && group.totalCount > 0;
      })
      .map((cat) => {
        const group = grouped.get(cat.id)!;
        const tagIds = group.tags.map((t) => t.id).join(',');
        return { ...cat, tagIds };
      });
  }, [tags]);

  // Handle ZIP change from results view
  const handleZipChange = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = zipInput.trim();
    if (!/^\d{5}$/.test(trimmed)) return;
    if (trimmed === zip) return;
    setZip(trimmed);
    setSelectedTag(null);
    setSearchTerms('');
    setPrograms([]);
    setCommunityResources([]);
    setInformationalResources([]);
    fetchTags(trimmed);
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

  // Scroll card into view when hovered from map
  useEffect(() => {
    if (hoveredFromMap && hoveredProgramId && listPanelRef.current) {
      const card = document.getElementById(`program-card-${hoveredProgramId}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [hoveredFromMap, hoveredProgramId]);

  // Handlers for hover sync
  const handleCardHover = useCallback((programId: string | null) => {
    setHoveredFromMap(false);
    setHoveredProgramId(programId);
  }, []);

  const handleMapHover = useCallback((programId: string | null) => {
    setHoveredFromMap(true);
    setHoveredProgramId(programId);
  }, []);

  const hasMore = programs.length < totalCount;

  // Convert CommunityResource to ProgramLite shape for ProgramCard
  const communityToProgramLite = useCallback((resource: CommunityResource): ProgramLite => ({
    id: resource.id,
    name: resource.name,
    provider_name: resource.provider_name,
    description: resource.description,
    availability: 'available' as const,
    free_or_reduced: 'indeterminate' as const,
    next_steps: [
      ...(resource.phone ? [{ channel: 'phone' as const, action: 'call', contact: resource.phone }] : []),
      ...(resource.website_url ? [{ channel: 'website' as const, action: 'visit', contact: resource.website_url }] : []),
    ],
    offices: [],
    service_tags: [],
  }), []);

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
        <div className={widget ? 'py-4' : 'py-8'}>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-fg-navy">
                {selectedTagLabel} in {zip}
              </h2>
              <p className="text-gray-500">
                {informationalResources.length > 0 && (
                  <>{informationalResources.length} {informationalResources.length === 1 ? 'guide' : 'guides'}{' '}&bull;{' '}</>
                )}
                {communityResources.length > 0 && (
                  <>{communityResources.length} recommended{' '}&bull;{' '}</>
                )}
                {totalCount} {totalCount === 1 ? 'program' : 'programs'} found
              </p>
            </div>

            {/* View toggle — hidden on desktop split view and in widget mode */}
            <div className={`flex bg-gray-100 rounded-lg p-1 lg:hidden ${widget ? 'hidden' : ''}`}>
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

          {/* Category bar + search */}
          <div className="mb-6 space-y-3">
            {/* Category chips */}
            {availableCategories.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                {availableCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedTag === cat.tagIds;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySwitch(cat.tagIds, cat.label)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                        isActive
                          ? 'bg-fg-blue text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ZIP + Keyword search */}
            <div className="flex gap-2">
              {/* ZIP input */}
              <form onSubmit={handleZipChange} className="flex-shrink-0">
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{5}"
                    maxLength={5}
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onBlur={handleZipChange as unknown as React.FocusEventHandler}
                    className="w-[7rem] pl-8 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fg-blue/30 focus:border-fg-blue"
                  />
                </div>
              </form>

              {/* Keyword input */}
              <form onSubmit={handleTermsSearch} className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerms}
                    onChange={(e) => setSearchTerms(e.target.value)}
                    placeholder="Search by keyword..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fg-blue/30 focus:border-fg-blue"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-fg-navy text-white rounded-lg text-sm font-medium hover:bg-fg-blue transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Save hint — hidden in widget mode */}
            {!widget && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Click the heart on any program to save it. Access your saved list from the &ldquo;Saved&rdquo; button above.
              </p>
            )}
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
          {!programsLoading && !programsError && programs.length === 0 && communityResources.length === 0 && informationalResources.length === 0 && (
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
          {!programsLoading && !programsError && (programs.length > 0 || communityResources.length > 0 || informationalResources.length > 0) && (
            <>
              {/* Desktop split view (lg+) — hidden in widget mode */}
              {!widget && (
                <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
                  {/* List panel */}
                  <div>
                    <div
                      ref={listPanelRef}
                      className="max-h-[600px] overflow-y-auto space-y-4 p-1 -m-1"
                    >
                      {/* Informational Resources Section */}
                      {informationalResources.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                              Guides & Resources
                            </span>
                            <span className="text-xs text-gray-400">
                              {informationalResources.length} {informationalResources.length === 1 ? 'resource' : 'resources'}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {(informationalExpanded ? informationalResources : informationalResources.slice(0, 4)).map((resource) => (
                              <InformationalResourceCard key={resource.id} resource={resource} />
                            ))}
                          </div>
                          {informationalResources.length > 4 && !informationalExpanded && (
                            <button
                              onClick={() => setInformationalExpanded(true)}
                              className="mt-2 text-sm font-medium text-fg-blue hover:text-fg-navy transition-colors"
                            >
                              Show all {informationalResources.length} guides
                            </button>
                          )}
                        </div>
                      )}
                      {communityResources.map((resource) => (
                        <ProgramCard
                          key={resource.id}
                          id={`program-card-${resource.id}`}
                          program={communityToProgramLite(resource)}
                          source="community"
                          onClick={() => handleProgramClick(resource.id)}
                          isHighlighted={hoveredProgramId === resource.id}
                          onMouseEnter={() => handleCardHover(resource.id)}
                          onMouseLeave={() => handleCardHover(null)}
                        />
                      ))}
                      {programs.map((program) => (
                        <ProgramCard
                          key={program.id}
                          id={`program-card-${program.id}`}
                          program={program}
                          onClick={() => handleProgramClick(program.id)}
                          isHighlighted={hoveredProgramId === program.id}
                          onMouseEnter={() => handleCardHover(program.id)}
                          onMouseLeave={() => handleCardHover(null)}
                        />
                      ))}
                    </div>
                    {hasMore && (
                      <div className="mt-6 text-center">
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
                  </div>

                  {/* Map panel */}
                  <div className="h-[600px] sticky top-4 rounded-xl overflow-hidden border border-gray-200">
                    <ProgramMap
                      programs={programs}
                      onProgramSelect={handleProgramClick}
                      selectedProgramId={modalProgramId}
                      hoveredProgramId={hoveredProgramId}
                      onProgramHover={handleMapHover}
                    />
                  </div>
                </div>
              )}

              {/* List view — mobile (<lg) or widget mode */}
              <div className={widget ? '' : 'lg:hidden'}>
                {viewMode === 'list' ? (
                  widget ? (
                    /* Compact card list for widget */
                    <div className="space-y-2">
                      {/* Informational Resources Section */}
                      {informationalResources.length > 0 && (
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                              Guides & Resources
                            </span>
                          </div>
                          <div className="space-y-2">
                            {(informationalExpanded ? informationalResources : informationalResources.slice(0, 4)).map((resource) => (
                              <InformationalResourceCard key={resource.id} resource={resource} />
                            ))}
                          </div>
                          {informationalResources.length > 4 && !informationalExpanded && (
                            <button
                              onClick={() => setInformationalExpanded(true)}
                              className="mt-1 text-xs font-medium text-fg-blue hover:text-fg-navy transition-colors"
                            >
                              Show all {informationalResources.length} guides
                            </button>
                          )}
                        </div>
                      )}
                      {communityResources.map((resource) => (
                        <ProgramCard
                          key={resource.id}
                          program={communityToProgramLite(resource)}
                          source="community"
                          onClick={() => handleProgramClick(resource.id)}
                          compact
                        />
                      ))}
                      {programs.map((program) => (
                        <ProgramCard
                          key={program.id}
                          program={program}
                          onClick={() => handleProgramClick(program.id)}
                          compact
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Informational Resources Section */}
                      {informationalResources.length > 0 && (
                        <div className="col-span-full mb-2">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                              Guides & Resources
                            </span>
                            <span className="text-xs text-gray-400">
                              {informationalResources.length} {informationalResources.length === 1 ? 'resource' : 'resources'}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {(informationalExpanded ? informationalResources : informationalResources.slice(0, 4)).map((resource) => (
                              <InformationalResourceCard key={resource.id} resource={resource} />
                            ))}
                          </div>
                          {informationalResources.length > 4 && !informationalExpanded && (
                            <button
                              onClick={() => setInformationalExpanded(true)}
                              className="mt-2 text-sm font-medium text-fg-blue hover:text-fg-navy transition-colors"
                            >
                              Show all {informationalResources.length} guides
                            </button>
                          )}
                        </div>
                      )}
                      {communityResources.map((resource) => (
                        <ProgramCard
                          key={resource.id}
                          program={communityToProgramLite(resource)}
                          source="community"
                          onClick={() => handleProgramClick(resource.id)}
                        />
                      ))}
                      {programs.map((program) => (
                        <ProgramCard
                          key={program.id}
                          program={program}
                          onClick={() => handleProgramClick(program.id)}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-gray-200">
                    <ProgramMap
                      programs={programs}
                      onProgramSelect={handleProgramClick}
                      selectedProgramId={modalProgramId}
                    />
                  </div>
                )}

                {/* Load more (mobile, non-widget) */}
                {!widget && viewMode === 'list' && hasMore && (
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

                {/* View all link (widget only) */}
                {widget && hasMore && (
                  <div className="mt-4 text-center">
                    <a
                      href={`https://www.fostergreatness.co/services`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-fg-blue hover:text-fg-navy transition-colors"
                    >
                      View all {totalCount} results on Foster Greatness
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
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
        onTagSearch={handleTagSearch}
        communityResource={modalCommunityResource}
      />
    </div>
  );
}

// Main export wraps with provider
interface ProgramSearchProps {
  initialZip?: string;
  initialProgramId?: string;
  widget?: boolean;
}

export default function ProgramSearch({ initialZip, initialProgramId, widget }: ProgramSearchProps) {
  return (
    <ResourceBoardProvider>
      <ProgramSearchInner initialZip={initialZip} initialProgramId={initialProgramId} widget={widget} />
    </ResourceBoardProvider>
  );
}
