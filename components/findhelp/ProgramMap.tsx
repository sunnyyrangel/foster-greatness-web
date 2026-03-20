'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Search } from 'lucide-react';
import type { ProgramLite, Office } from '@/lib/findhelp';
import { escapeHTML } from '@/lib/findhelp';

interface ProgramMapProps {
  programs: ProgramLite[];
  onProgramSelect?: (programId: string) => void;
  selectedProgramId?: string | null;
  center?: { lat: number; lng: number };
  hoveredProgramId?: string | null;
  onProgramHover?: (programId: string | null) => void;
  currentZip?: string;
  onSearchArea?: (zip: string) => void;
}

// Get all offices with coordinates from programs
function getOfficesWithCoords(programs: ProgramLite[]): Array<{
  program: ProgramLite;
  office: Office;
  lat: number;
  lng: number;
}> {
  const offices: Array<{
    program: ProgramLite;
    office: Office;
    lat: number;
    lng: number;
  }> = [];

  for (const program of programs) {
    for (const office of program.offices) {
      if (office.location?.latitude && office.location?.longitude) {
        offices.push({
          program,
          office,
          lat: office.location.latitude,
          lng: office.location.longitude,
        });
      }
    }
  }

  return offices;
}

// Create a marker element (default style)
function createMarkerElement(): HTMLDivElement {
  const el = document.createElement('div');
  el.style.borderRadius = '50%';
  el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  el.style.cursor = 'pointer';
  el.style.transition = 'width 0.15s, height 0.15s, background-color 0.15s, border-color 0.15s';
  applyMarkerStyle(el, 'default');
  return el;
}

// Apply style to a marker element
function applyMarkerStyle(el: HTMLDivElement, state: 'default' | 'hovered' | 'selected') {
  switch (state) {
    case 'selected':
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.backgroundColor = '#00c8b7';
      el.style.border = '3px solid #1a2949';
      el.style.zIndex = '3';
      break;
    case 'hovered':
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.backgroundColor = '#00c8b7';
      el.style.border = '3px solid #1a2949';
      el.style.zIndex = '2';
      break;
    default:
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.backgroundColor = '#1a2949';
      el.style.border = '2px solid #fff';
      el.style.zIndex = '1';
      break;
  }
}

// Build popup HTML for an office
function buildPopupHTML(program: ProgramLite, office: Office): string {
  const address = [office.address1, office.city, office.state]
    .filter(Boolean)
    .join(', ');

  const websiteUrl = office.website_url || program.website_url;

  let html = `<div style="max-width:240px;font-family:Poppins,sans-serif;">`;
  html += `<h3 style="font-weight:700;color:#1a2949;margin:0 0 4px;font-size:14px;">${escapeHTML(program.name)}</h3>`;
  html += `<p style="color:#6b7280;font-size:12px;margin:0 0 8px;">${escapeHTML(program.provider_name)}</p>`;

  if (address) {
    html += `<p style="color:#4b5563;font-size:12px;margin:0 0 8px;">${escapeHTML(address)}</p>`;
  }

  html += `<div style="display:flex;gap:8px;flex-wrap:wrap;">`;

  if (office.phone_number) {
    html += `<a href="tel:${escapeHTML(office.phone_number)}" style="color:#0067a2;font-size:12px;text-decoration:none;">📞 Call</a>`;
  }

  if (websiteUrl) {
    html += `<a href="${escapeHTML(websiteUrl)}" target="_blank" rel="noopener noreferrer" style="color:#0067a2;font-size:12px;text-decoration:none;">🌐 Website</a>`;
  }

  html += `<a href="#" class="mapbox-details-link" data-program-id="${escapeHTML(program.id)}" style="color:#0067a2;font-size:12px;text-decoration:none;">📋 Details</a>`;

  html += `</div></div>`;
  return html;
}

export default function ProgramMap({
  programs,
  onProgramSelect,
  selectedProgramId,
  center: propCenter,
  hoveredProgramId,
  onProgramHover,
  currentZip,
  onSearchArea,
}: ProgramMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const markerElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const popupFromClickRef = useRef(false);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [searchingArea, setSearchingArea] = useState(false);
  const userPannedRef = useRef(false);

  const officesWithCoords = useMemo(() => getOfficesWithCoords(programs), [programs]);

  const center = useMemo(() => {
    if (propCenter) return propCenter;
    if (officesWithCoords.length === 0) return { lat: 39.8283, lng: -98.5795 };
    // Use the first office as center anchor — API returns results sorted by
    // distance from the searched ZIP, so this is closest to the user's location
    return { lat: officesWithCoords[0].lat, lng: officesWithCoords[0].lng };
  }, [propCenter, officesWithCoords]);

  // Store callbacks in refs so markers can access latest versions
  const onProgramSelectRef = useRef(onProgramSelect);
  onProgramSelectRef.current = onProgramSelect;
  const onProgramHoverRef = useRef(onProgramHover);
  onProgramHoverRef.current = onProgramHover;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || officesWithCoords.length === 0) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [center.lng, center.lat],
      zoom: 10,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    mapRef.current = map;

    // Listen for details link clicks
    map.getContainer().addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('mapbox-details-link')) {
        e.preventDefault();
        const programId = target.getAttribute('data-program-id');
        if (programId) {
          onProgramSelectRef.current?.(programId);
        }
      }
    });

    // Show "Search this area" button when user drags/zooms the map
    if (onSearchArea) {
      map.on('dragend', () => {
        userPannedRef.current = true;
        setShowSearchArea(true);
      });
      map.on('zoomend', () => {
        // Only show on user-initiated zoom (not fitBounds)
        if (userPannedRef.current) {
          setShowSearchArea(true);
        }
      });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear "search this area" when new results load
  useEffect(() => {
    setShowSearchArea(false);
    userPannedRef.current = false;
  }, [programs]);

  // Create markers when programs change (not on selection/hover)
  const updateMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    markerElementsRef.current.clear();

    // Close existing popup
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (officesWithCoords.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    const MAX_RADIUS_MILES = 10;

    // Haversine distance in miles
    function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
      const R = 3958.8;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    officesWithCoords.forEach((data) => {
      const el = createMarkerElement();
      markerElementsRef.current.set(data.program.id, el);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([data.lng, data.lat])
        .addTo(map);

      el.addEventListener('click', () => {
        // Close existing popup
        if (popupRef.current) {
          popupRef.current.remove();
        }

        const popup = new mapboxgl.Popup({ offset: 15, maxWidth: '280px', closeOnClick: true })
          .setLngLat([data.lng, data.lat])
          .setHTML(buildPopupHTML(data.program, data.office))
          .addTo(map);

        popupRef.current = popup;
        popupFromClickRef.current = true;
        popup.on('close', () => {
          if (popupRef.current === popup) {
            popupRef.current = null;
            popupFromClickRef.current = false;
          }
        });
        onProgramSelectRef.current?.(data.program.id);
      });

      // Hover events for bidirectional sync + hover popup
      el.addEventListener('mouseenter', () => {
        onProgramHoverRef.current?.(data.program.id);

        // Show popup on hover (unless a click popup is already open)
        if (!popupFromClickRef.current) {
          if (popupRef.current) {
            popupRef.current.remove();
          }
          const popup = new mapboxgl.Popup({ offset: 15, maxWidth: '280px', closeButton: false, closeOnClick: false })
            .setLngLat([data.lng, data.lat])
            .setHTML(buildPopupHTML(data.program, data.office))
            .addTo(map);
          popupRef.current = popup;
        }
      });
      el.addEventListener('mouseleave', () => {
        onProgramHoverRef.current?.(null);

        // Close hover popup (but not click popups)
        if (!popupFromClickRef.current && popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });

      // Only include nearby markers in bounds calculation
      const dist = distanceMiles(center.lat, center.lng, data.lat, data.lng);
      if (dist <= MAX_RADIUS_MILES) {
        bounds.extend([data.lng, data.lat]);
      }
      markersRef.current.push(marker);
    });

    // If no markers within radius, fall back to center point
    if (bounds.isEmpty()) {
      bounds.extend([center.lng, center.lat]);
    }
    map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
  }, [officesWithCoords]);

  // Update marker styles when hover/selection changes (no marker rebuild)
  useEffect(() => {
    markerElementsRef.current.forEach((el, programId) => {
      if (selectedProgramId === programId) {
        applyMarkerStyle(el, 'selected');
      } else if (hoveredProgramId === programId) {
        applyMarkerStyle(el, 'hovered');
      } else {
        applyMarkerStyle(el, 'default');
      }
    });
  }, [hoveredProgramId, selectedProgramId]);

  // Run updateMarkers when map is loaded or data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.loaded()) {
      updateMarkers();
    } else {
      map.on('load', updateMarkers);
      return () => {
        map.off('load', updateMarkers);
      };
    }
  }, [updateMarkers]);

  // No token
  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Unable to load map</p>
          <p className="text-sm text-gray-400">Map configuration is missing</p>
        </div>
      </div>
    );
  }

  // No programs state
  if (officesWithCoords.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No locations to display</p>
          <p className="text-sm text-gray-400">Programs without address data cannot be shown on the map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden">
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
      {showSearchArea && onSearchArea && (
        <button
          disabled={searchingArea}
          onClick={async () => {
            const map = mapRef.current;
            if (!map) return;
            setSearchingArea(true);
            const mapCenter = map.getCenter();
            const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
            if (!token) return;
            try {
              const res = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${mapCenter.lng},${mapCenter.lat}.json?types=postcode&country=US&limit=1&access_token=${token}`
              );
              const data = await res.json();
              const newZip = data.features?.[0]?.text;
              if (newZip && /^\d{5}$/.test(newZip)) {
                onSearchArea(newZip);
                setShowSearchArea(false);
              }
            } catch {
              // Silently fail
            } finally {
              setSearchingArea(false);
            }
          }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 px-4 py-2.5 bg-white text-fg-navy font-semibold text-sm rounded-full shadow-lg border border-gray-200 hover:bg-fg-navy hover:text-white transition-colors disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          {searchingArea ? 'Searching...' : 'Search this area'}
        </button>
      )}
    </div>
  );
}
