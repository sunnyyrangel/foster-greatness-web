'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { trackEvent } from '@/lib/analytics';
import { List, Map, Heart, ArrowLeft, Search, MapPin, ExternalLink, Clock, DollarSign, X, ChevronLeft, ChevronRight, HandHeart } from 'lucide-react';
import type { ServiceTag, ProgramLite, Office, OfficeHours, Availability, FreeOrReduced, NextStep } from '@/lib/findhelp';
import { matchesOpenNowFilter } from '@/lib/findhelp';
import type { CommunityResource, InformationalResource } from '@/lib/resources';
import { ResourceBoardProvider, useResourceBoard } from './ResourceBoardContext';
import ResourceBoard from './ResourceBoard';
import ZipCodeInput from './ZipCodeInput';
import ServiceTagSelector, { CATEGORIES, groupTagsByCategory } from './ServiceTagSelector';
import ProgramCard from './ProgramCard';
import ProgramDetailModal from './ProgramDetailModal';
import InformationalResourceCard from './InformationalResourceCard';
import ProgramMap from './ProgramMap';
import AttributeTagFilter from './AttributeTagFilter';

type ViewMode = 'list' | 'map';
type SearchStep = 'zip' | 'category' | 'results';

interface ProgramSearchInnerProps {
  initialZip?: string;
  initialProgramId?: string;
  initialView?: 'map';
  initialServiceTag?: string;
  initialTerms?: string;
  widget?: boolean;
}

function ProgramSearchInner({ initialZip, initialProgramId, initialView, initialServiceTag, initialTerms, widget }: ProgramSearchInnerProps) {
  // State
  const [step, setStep] = useState<SearchStep>(
    initialZip && (initialServiceTag || initialTerms) ? 'results'
    : initialZip ? 'category'
    : 'zip'
  );
  const [zip, setZip] = useState(initialZip || '');
  const [zipInput, setZipInput] = useState(initialZip || '');
  const [tags, setTags] = useState<ServiceTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedTagLabel, setSelectedTagLabel] = useState<string>('');
  const [programs, setPrograms] = useState<ProgramLite[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView || 'list');
  const [boardOpen, setBoardOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState('');
  const [zipCenter, setZipCenter] = useState<{ lat: number; lng: number } | undefined>();

  // Filter state
  const [filterFree, setFilterFree] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [selectedAttributeTags, setSelectedAttributeTags] = useState<Set<string>>(new Set());

  // Community resources state
  const [communityResources, setCommunityResources] = useState<CommunityResource[]>([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [modalCommunityResource, setModalCommunityResource] = useState<CommunityResource | null>(null);

  // Informational resources state
  const [informationalResources, setInformationalResources] = useState<InformationalResource[]>([]);
  const [informationalLoading, setInformationalLoading] = useState(false);
  const [resultsTab, setResultsTab] = useState<'programs' | 'guides'>('programs');

  // Loading states
  const [tagsLoading, setTagsLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(!!(initialZip && (initialServiceTag || initialTerms)));
  const [loadingMore, setLoadingMore] = useState(false);

  // Error states
  const [tagsError, setTagsError] = useState<string | null>(null);
  const [programsError, setProgramsError] = useState<string | null>(null);

  // Hover sync state
  const [hoveredProgramId, setHoveredProgramId] = useState<string | null>(null);
  const [hoveredFromMap, setHoveredFromMap] = useState(false);
  const listPanelRef = useRef<HTMLDivElement>(null);
  const isDeepLinked = useRef(!!(initialZip && (initialServiceTag || initialTerms)));

  // Modal state
  const [modalProgramId, setModalProgramId] = useState<string | null>(initialProgramId || null);
  const [modalOpen, setModalOpen] = useState(!!initialProgramId);

  // Resource board
  const { savedPrograms } = useResourceBoard();

  // Fetch service tags for ZIP code
  const fetchTags = useCallback(async (zipCode: string, autoSelectTag?: string) => {
    setTagsLoading(true);
    setTagsError(null);

    try {
      const response = await fetch(`/api/findhelp/tags?zip=${zipCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load categories');
      }

      const loadedTags = data.data.tags || [];
      setTags(loadedTags);

      // If autoSelectTag provided (deep link), skip category step and go straight to results
      if (autoSelectTag && loadedTags.length > 0) {
        const grouped = groupTagsByCategory(loadedTags);
        for (const category of CATEGORIES) {
          const group = grouped.get(category.id);
          if (!group) continue;
          const tagIds = group.tags.map((t: ServiceTag) => t.id).join(',');
          if (tagIds === autoSelectTag || autoSelectTag.split(',').some((id: string) => tagIds.includes(id))) {
            setSelectedTag(tagIds);
            setSelectedTagLabel(category.label);
            setStep('results');
            setProgramsLoading(true);
            return { matched: true, tagIds, label: category.label };
          }
        }
        // No category match — use raw tag IDs
        setSelectedTag(autoSelectTag);
        setStep('results');
        setProgramsLoading(true);
        return { matched: true, tagIds: autoSelectTag, label: '' };
      }

      setStep('category');
    } catch (error) {
      setTagsError(error instanceof Error ? error.message : 'Failed to load categories');
    } finally {
      setTagsLoading(false);
    }
    return { matched: false, tagIds: '', label: '' };
  }, []);

  // Fetch programs
  const fetchPrograms = useCallback(
    async (tagId: string, cursorValue: number = 0, append: boolean = false, terms?: string, attrTags?: Set<string>) => {
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
        const effectiveAttrTags = attrTags ?? selectedAttributeTags;
        if (effectiveAttrTags.size > 0) {
          params.set('attributeTag', Array.from(effectiveAttrTags).join(','));
        }

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
    [zip, selectedAttributeTags]
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

  // Geocode ZIP to get map center coordinates
  const geocodeZip = useCallback(async (zipCode: string) => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json?types=postcode&country=US&access_token=${token}`
      );
      const data = await res.json();
      if (data.features?.[0]?.center) {
        const [lng, lat] = data.features[0].center;
        setZipCenter({ lat, lng });
      }
    } catch {
      // Silently fail — map will fall back to first office
    }
  }, []);

  // Handle ZIP submission
  const handleZipSubmit = (zipCode: string) => {
    setZip(zipCode);
    setZipInput(zipCode);
    setSelectedTag(null);
    setPrograms([]);
    fetchTags(zipCode);
    geocodeZip(zipCode);
    trackEvent('service_search', { zip: zipCode, channel: widget ? 'embed' : 'web' });
  };

  // Handle category selection
  const handleCategorySelect = useCallback((tagIds: string, label: string) => {
    setSelectedTag(tagIds);
    setSelectedTagLabel(label);
    setCursor(0);
    setCurrentPage(1);
    setCommunityResources([]);
    setInformationalResources([]);
    setResultsTab('programs');
    setFilterFree(false);
    setFilterOpenNow(false);
    const emptyAttrTags = new Set<string>();
    setSelectedAttributeTags(emptyAttrTags);
    // Transition to results view immediately so skeleton shows while loading
    setStep('results');
    setProgramsLoading(true);
    // Fire all three fetches in parallel for faster results
    fetchPrograms(tagIds, 0, false, undefined, emptyAttrTags);
    fetchCommunityResources(zip, label);
    fetchInformationalResources(zip, label);
    trackEvent('service_category_select', { category: label, zip, channel: widget ? 'embed' : 'web' });
  }, [fetchPrograms, fetchCommunityResources, fetchInformationalResources, zip, widget]);

  // Handle load more
  const handleLoadMore = () => {
    if ((selectedTag || searchTerms) && !loadingMore) {
      fetchPrograms(selectedTag || '', cursor, true, searchTerms || undefined, selectedAttributeTags);
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
      clearFilters();
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
    setCurrentPage(1);
    setCommunityResources([]);
    setInformationalResources([]);
    setResultsTab('programs');
    clearFilters();
    const emptyAttrTags = new Set<string>();
    setSelectedAttributeTags(emptyAttrTags);
    setSelectedTagLabel(`"${searchTerms.trim()}"`);
    fetchPrograms('', 0, false, searchTerms.trim(), emptyAttrTags);
    trackEvent('service_keyword_search', { terms: searchTerms.trim(), zip, channel: widget ? 'embed' : 'web' });
  };

  // Handle category switch from results view
  const handleCategorySwitch = (tagIds: string, label: string) => {
    setSelectedTag(tagIds);
    setSelectedTagLabel(label);
    setSearchTerms('');
    setCursor(0);
    setCurrentPage(1);
    setCommunityResources([]);
    setInformationalResources([]);
    setResultsTab('programs');
    clearFilters();
    const emptyAttrTags = new Set<string>();
    setSelectedAttributeTags(emptyAttrTags);
    // Show skeleton immediately, fire all fetches in parallel
    setProgramsLoading(true);
    fetchPrograms(tagIds, 0, false, undefined, emptyAttrTags);
    fetchCommunityResources(zip, label);
    fetchInformationalResources(zip, label);
  };

  // Compute categories for the category bar
  const availableCategories = useMemo(() => {
    if (tags.length === 0) return [];
    const grouped = groupTagsByCategory(tags);
    return CATEGORIES.map((cat) => {
      const group = grouped.get(cat.id)!;
      const tagIds = group.tags.map((t) => t.id).join(',');
      return { ...cat, tagIds };
    });
  }, [tags]);

  // Client-side filtered programs
  const clientFiltersActive = filterFree || filterOpenNow;
  const serverFiltersActive = selectedAttributeTags.size > 0;
  const filtersActive = clientFiltersActive || serverFiltersActive;
  const filteredPrograms = useMemo(() => {
    if (!clientFiltersActive) return programs;
    return programs.filter((p) => {
      if (filterFree && p.free_or_reduced !== 'free') return false;
      if (filterOpenNow && !matchesOpenNowFilter(p)) return false;
      return true;
    });
  }, [programs, filterFree, filterOpenNow, clientFiltersActive]);

  // Helper to clear filters
  const clearFilters = useCallback(() => {
    setFilterFree(false);
    setFilterOpenNow(false);
  }, []);

  // Handle attribute tag filter change (server-side filter)
  const handleAttributeTagChange = useCallback((tags: Set<string>) => {
    setSelectedAttributeTags(tags);
    setCursor(0);
    setCurrentPage(1);
    fetchPrograms(selectedTag || '', 0, false, searchTerms || undefined, tags);
    trackEvent('service_attribute_filter', {
      tags: Array.from(tags).join(','),
      count: tags.size,
      zip,
      channel: widget ? 'embed' : 'web',
    });
  }, [selectedTag, searchTerms, fetchPrograms, zip, widget]);

  // Handle removing a single attribute tag chip
  const handleRemoveAttributeTag = useCallback((tagToRemove: string) => {
    const next = new Set(selectedAttributeTags);
    next.delete(tagToRemove);
    setSelectedAttributeTags(next);
    setCursor(0);
    setCurrentPage(1);
    fetchPrograms(selectedTag || '', 0, false, searchTerms || undefined, next);
    trackEvent('service_attribute_filter', {
      tags: Array.from(next).join(','),
      count: next.size,
      zip,
      channel: widget ? 'embed' : 'web',
    });
  }, [selectedAttributeTags, selectedTag, searchTerms, fetchPrograms, zip, widget]);

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
    geocodeZip(trimmed);
  };

  // Auto-open modal if initialProgramId provided
  useEffect(() => {
    if (initialProgramId && initialZip) {
      setModalProgramId(initialProgramId);
      setModalOpen(true);
    }
  }, [initialProgramId, initialZip]);

  // Fetch tags if initialZip provided, auto-select category if deep-linked
  useEffect(() => {
    if (!initialZip) return;
    geocodeZip(initialZip);

    const init = async () => {
      const result = await fetchTags(initialZip, initialServiceTag);

      // If category was auto-selected, fire all searches in parallel
      if (result?.matched && result.tagIds) {
        const emptyAttrTags = new Set<string>();
        fetchPrograms(result.tagIds, 0, false, undefined, emptyAttrTags);
        fetchCommunityResources(initialZip, result.label);
        fetchInformationalResources(initialZip, result.label);
      } else if (initialTerms && !initialServiceTag) {
        // Keyword search deep link
        setSearchTerms(initialTerms);
        setStep('results');
        setSelectedTagLabel(`"${initialTerms}"`);
        fetchPrograms('', 0, false, initialTerms, new Set());
      }
      // Deep link initialization complete — allow category picker to render on back nav
      isDeepLinked.current = false;
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const pageSize = widget ? 6 : 20;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Page change handler
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    const newCursor = (page - 1) * pageSize;
    fetchPrograms(selectedTag || '', newCursor, false, searchTerms || undefined, selectedAttributeTags);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages, currentPage, pageSize, selectedTag, searchTerms, selectedAttributeTags, fetchPrograms]);

  // Pagination UI
  const renderPagination = useCallback(() => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-1 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((page, i) =>
          typeof page === 'string' ? (
            <span key={`ellipsis-${i}`} className="px-1 py-2 text-sm text-gray-400">&hellip;</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-fg-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }, [totalPages, currentPage, handlePageChange]);

  // Convert CommunityResource to ProgramLite shape for ProgramCard
  const communityToProgramLite = useCallback((resource: CommunityResource): ProgramLite => {
    const nextSteps: NextStep[] = [];
    if (resource.phone) nextSteps.push({ channel: 'phone', action: 'call', contact: resource.phone });
    if (resource.website_url) nextSteps.push({ channel: 'website', action: 'visit', contact: resource.website_url });
    if (resource.email) nextSteps.push({ channel: 'email', action: 'email', contact: resource.email });

    const offices: Office[] = [];
    if (resource.address || resource.latitude) {
      offices.push({
        address1: resource.address,
        city: resource.city,
        state: resource.state,
        postal: resource.zip,
        is_administrative: false,
        ...(resource.latitude && resource.longitude && {
          location: { latitude: resource.latitude, longitude: resource.longitude },
        }),
        ...(resource.phone && { phone_number: resource.phone }),
        ...(resource.website_url && { website_url: resource.website_url }),
        ...(resource.hours && { hours: resource.hours as OfficeHours }),
        ...(resource.languages && { supported_languages: resource.languages }),
      });
    }

    // Map coverage_level to Findhelp grain/grain_location for reach labels
    const grain = resource.coverage_level === 'national'
      ? 'national' as const
      : resource.coverage_level === 'statewide' || resource.coverage_level === 'multi_state'
        ? 'state' as const
        : undefined;
    const grain_location = (resource.coverage_level === 'statewide' || resource.coverage_level === 'multi_state')
      ? resource.states
      : undefined;

    return {
      id: resource.id,
      name: resource.name,
      provider_name: resource.provider_name,
      description: resource.description,
      availability: (resource.availability as Availability) ?? 'available',
      free_or_reduced: (resource.free_or_reduced as FreeOrReduced) ?? 'indeterminate',
      next_steps: nextSteps,
      offices,
      service_tags: resource.service_tags ?? [],
      ...(grain && { grain }),
      ...(grain_location && { grain_location }),
    };
  }, []);

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

      {/* Category Selection — hidden during deep-link initialization to prevent flash */}
      {step === 'category' && !isDeepLinked.current && (
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
                {resultsTab === 'guides' ? (
                  <>{informationalResources.length} {informationalResources.length === 1 ? 'guide' : 'guides'} &amp; resources</>
                ) : (
                  <>
                    {communityResources.length > 0 && (
                      <>{communityResources.length} recommended{' '}&bull;{' '}</>
                    )}
                    {clientFiltersActive
                      ? `${filteredPrograms.length} of ${totalCount} programs (filtered)`
                      : serverFiltersActive
                        ? `${totalCount} ${totalCount === 1 ? 'program' : 'programs'} found (filtered)`
                        : `${totalCount} ${totalCount === 1 ? 'program' : 'programs'} found`}
                  </>
                )}
              </p>
            </div>

            {/* View on map — widget only */}
            {widget && resultsTab !== 'guides' && (
              <a
                href={`${widget ? 'https://www.fostergreatness.co' : ''}/services?zip=${zip}${selectedTag ? `&serviceTag=${selectedTag}` : ''}${searchTerms ? `&terms=${encodeURIComponent(searchTerms)}` : ''}&view=map`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-fg-blue/10 text-fg-blue hover:bg-fg-blue/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Map className="w-3.5 h-3.5" />
                Map
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* View toggle — hidden on desktop split view and in widget mode */}
            <div className={`flex bg-gray-100 rounded-lg p-1 lg:hidden ${widget || resultsTab === 'guides' ? 'hidden' : ''}`}>
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

            {/* Filter chips — only on Programs tab */}
            {resultsTab === 'programs' && (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      const next = !filterFree;
                      setFilterFree(next);
                      trackEvent('service_filter_toggle', { filter: 'free', active: next, zip });
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filterFree
                        ? 'bg-green-100 text-green-700 ring-1 ring-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    Free
                  </button>
                  <button
                    onClick={() => {
                      const next = !filterOpenNow;
                      setFilterOpenNow(next);
                      trackEvent('service_filter_toggle', { filter: 'open_now', active: next, zip });
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filterOpenNow
                        ? 'bg-green-100 text-green-700 ring-1 ring-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Open Now
                  </button>
                  <button
                    onClick={() => {
                      const active = selectedAttributeTags.has('foster youth');
                      const next = new Set(selectedAttributeTags);
                      if (active) {
                        next.delete('foster youth');
                      } else {
                        next.add('foster youth');
                      }
                      handleAttributeTagChange(next);
                      trackEvent('service_filter_toggle', { filter: 'foster_youth', active: !active, zip });
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedAttributeTags.has('foster youth')
                        ? 'bg-green-100 text-green-700 ring-1 ring-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <HandHeart className="w-3.5 h-3.5" />
                    Foster Youth
                  </button>
                  <AttributeTagFilter
                    selectedTags={selectedAttributeTags}
                    onChange={handleAttributeTagChange}
                  />
                  {/* Removable attribute tag chips */}
                  {Array.from(selectedAttributeTags).filter(t => t !== 'foster youth').map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-fg-blue/10 text-fg-blue ring-1 ring-fg-blue/20"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveAttributeTag(tag)}
                        className="ml-0.5 hover:text-fg-navy transition-colors"
                        aria-label={`Remove ${tag} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filtersActive && (
                    <>
                      {clientFiltersActive && (
                        <span className="text-xs text-gray-400">
                          Showing {filteredPrograms.length} of {programs.length} loaded
                        </span>
                      )}
                      <button
                        onClick={() => {
                          clearFilters();
                          if (selectedAttributeTags.size > 0) {
                            const emptyAttrTags = new Set<string>();
                            setSelectedAttributeTags(emptyAttrTags);
                            setCursor(0);
                            setCurrentPage(1);
                            fetchPrograms(selectedTag || '', 0, false, searchTerms || undefined, emptyAttrTags);
                          }
                        }}
                        className="text-xs text-fg-blue hover:text-fg-navy transition-colors"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>

                {/* Save hint — hidden in widget mode */}
                {!widget && !filtersActive && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Click the heart on any program to save it. Access your saved list from the &ldquo;Saved&rdquo; button above.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Results tabs */}
          {informationalResources.length > 0 && (
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setResultsTab('programs')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  resultsTab === 'programs'
                    ? 'border-fg-blue text-fg-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Programs
              </button>
              <button
                onClick={() => setResultsTab('guides')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  resultsTab === 'guides'
                    ? 'border-fg-blue text-fg-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Guides ({informationalResources.length})
              </button>
            </div>
          )}

          {/* Loading state — skeleton cards */}
          {programsLoading && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-fg-blue" />
                <p className="text-sm text-gray-500">Finding programs near {zip}...</p>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                      <div className="space-y-2 pt-1">
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-5/6" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <div className="h-7 bg-gray-100 rounded-full w-16" />
                        <div className="h-7 bg-gray-100 rounded-full w-20" />
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
                  </div>
                </div>
              ))}
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
              {resultsTab === 'guides' ? (
                /* Guides tab — full width, all breakpoints */
                <div className={widget ? 'space-y-2' : 'space-y-3'}>
                  {informationalResources.map((resource) => (
                    <InformationalResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
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
                          {filteredPrograms.map((program) => (
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

                          {/* Filtered-empty state */}
                          {filtersActive && filteredPrograms.length === 0 && programs.length > 0 && (
                            <div className="text-center py-10">
                              <p className="text-gray-500 mb-3">No programs match your current filters.</p>
                              <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-fg-blue bg-fg-blue/10 rounded-lg hover:bg-fg-blue/20 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                Clear filters
                              </button>
                            </div>
                          )}
                        </div>
                        {renderPagination()}
                      </div>

                      {/* Map panel */}
                      <div className="h-[600px] sticky top-4 rounded-xl overflow-hidden border border-gray-200">
                        <ProgramMap
                          programs={filteredPrograms}
                          onProgramSelect={handleProgramClick}
                          selectedProgramId={modalProgramId}
                          hoveredProgramId={hoveredProgramId}
                          onProgramHover={handleMapHover}
                          center={zipCenter}
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
                          {communityResources.map((resource) => (
                            <ProgramCard
                              key={resource.id}
                              program={communityToProgramLite(resource)}
                              source="community"
                              onClick={() => handleProgramClick(resource.id)}
                              compact
                            />
                          ))}
                          {filteredPrograms.map((program) => (
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
                          {communityResources.map((resource) => (
                            <ProgramCard
                              key={resource.id}
                              program={communityToProgramLite(resource)}
                              source="community"
                              onClick={() => handleProgramClick(resource.id)}
                            />
                          ))}
                          {filteredPrograms.map((program) => (
                            <ProgramCard
                              key={program.id}
                              program={program}
                              onClick={() => handleProgramClick(program.id)}
                            />
                          ))}

                          {/* Filtered-empty state (mobile) */}
                          {filtersActive && filteredPrograms.length === 0 && programs.length > 0 && (
                            <div className="col-span-full text-center py-10">
                              <p className="text-gray-500 mb-3">No programs match your current filters.</p>
                              <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-fg-blue bg-fg-blue/10 rounded-lg hover:bg-fg-blue/20 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                Clear filters
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-gray-200">
                        <ProgramMap
                          programs={filteredPrograms}
                          onProgramSelect={handleProgramClick}
                          selectedProgramId={modalProgramId}
                          center={zipCenter}
                        />
                      </div>
                    )}

                    {/* Load more (mobile, non-widget) */}
                    {!widget && viewMode === 'list' && renderPagination()}

                    {/* View all link (widget only) */}
                    {widget && (
                      <>
                        {renderPagination()}
                        {totalCount > pageSize && (
                          <div className="mt-4 text-center">
                            <a
                              href={`${widget ? 'https://www.fostergreatness.co' : ''}/services?zip=${zip}${selectedTag ? `&serviceTag=${selectedTag}` : ''}${searchTerms ? `&terms=${encodeURIComponent(searchTerms)}` : ''}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-fg-blue hover:text-fg-navy transition-colors"
                            >
                              View all {totalCount} results on Foster Greatness
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Suggest a Resource CTA */}
                  {!widget && (
                    <div className="mt-6 p-6 bg-[#ddf3ff]/30 rounded-lg border border-fg-blue/10 text-center">
                      <p className="text-fg-navy font-medium mb-2">
                        Know a great program?
                      </p>
                      <a
                        href={`/suggest-resource${zip || selectedTagLabel ? '?' : ''}${zip ? `zip=${zip}` : ''}${zip && selectedTagLabel ? '&' : ''}${selectedTagLabel ? `category=${encodeURIComponent(selectedTagLabel)}` : ''}`}
                        className="inline-block px-5 py-2.5 bg-fg-navy text-white rounded-md hover:bg-fg-navy/90 transition-colors font-medium text-sm"
                      >
                        Help us grow our resource directory
                      </a>
                    </div>
                  )}
                </>
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
  initialView?: 'map';
  initialServiceTag?: string;
  initialTerms?: string;
  widget?: boolean;
}

export default function ProgramSearch({ initialZip, initialProgramId, initialView, initialServiceTag, initialTerms, widget }: ProgramSearchProps) {
  return (
    <ResourceBoardProvider>
      <ProgramSearchInner initialZip={initialZip} initialProgramId={initialProgramId} initialView={initialView} initialServiceTag={initialServiceTag} initialTerms={initialTerms} widget={widget} />
    </ResourceBoardProvider>
  );
}
