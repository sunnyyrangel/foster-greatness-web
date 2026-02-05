'use client';

import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Phone, Globe, ExternalLink } from 'lucide-react';
import type { ProgramLite, Office } from '@/lib/findhelp';

interface ProgramMapProps {
  programs: ProgramLite[];
  onProgramSelect?: (programId: string) => void;
  selectedProgramId?: string | null;
  center?: { lat: number; lng: number };
}

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
};

// Default map options
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

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

// Calculate map center from offices
function calculateCenter(
  offices: Array<{ lat: number; lng: number }>
): { lat: number; lng: number } {
  if (offices.length === 0) {
    // Default to center of US
    return { lat: 39.8283, lng: -98.5795 };
  }

  const sum = offices.reduce(
    (acc, o) => ({ lat: acc.lat + o.lat, lng: acc.lng + o.lng }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / offices.length,
    lng: sum.lng / offices.length,
  };
}

export default function ProgramMap({
  programs,
  onProgramSelect,
  selectedProgramId,
  center: propCenter,
}: ProgramMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindowData, setInfoWindowData] = useState<{
    program: ProgramLite;
    office: Office;
    position: { lat: number; lng: number };
  } | null>(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // Get all offices with coordinates
  const officesWithCoords = useMemo(() => getOfficesWithCoords(programs), [programs]);

  // Calculate center
  const center = useMemo(
    () => propCenter || calculateCenter(officesWithCoords),
    [propCenter, officesWithCoords]
  );

  // Calculate bounds to fit all markers
  const fitBounds = useCallback(() => {
    if (!map || officesWithCoords.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    officesWithCoords.forEach((o) => {
      bounds.extend({ lat: o.lat, lng: o.lng });
    });

    // Add some padding
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, officesWithCoords]);

  // On map load
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      // Fit bounds after map loads
      if (officesWithCoords.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        officesWithCoords.forEach((o) => {
          bounds.extend({ lat: o.lat, lng: o.lng });
        });
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      }
    },
    [officesWithCoords]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle marker click
  const handleMarkerClick = (data: typeof officesWithCoords[0]) => {
    setInfoWindowData({
      program: data.program,
      office: data.office,
      position: { lat: data.lat, lng: data.lng },
    });
    onProgramSelect?.(data.program.id);
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fg-blue mx-auto mb-3" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Unable to load map</p>
          <p className="text-sm text-gray-400">Please check your connection and try again</p>
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
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {officesWithCoords.map((data, index) => {
          const isSelected = selectedProgramId === data.program.id;

          return (
            <Marker
              key={`${data.program.id}-${data.office.office_numeric_id || index}`}
              position={{ lat: data.lat, lng: data.lng }}
              onClick={() => handleMarkerClick(data)}
              icon={{
                url: isSelected
                  ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(isSelected ? 48 : 40, isSelected ? 48 : 40),
              }}
              animation={isSelected ? google.maps.Animation.BOUNCE : undefined}
              title={data.program.name}
            />
          );
        })}

        {infoWindowData && (
          <InfoWindow
            position={infoWindowData.position}
            onCloseClick={() => setInfoWindowData(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-fg-navy mb-1">{infoWindowData.program.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{infoWindowData.program.provider_name}</p>

              {infoWindowData.office.address1 && (
                <p className="text-sm text-gray-600 mb-2">
                  {[
                    infoWindowData.office.address1,
                    infoWindowData.office.city,
                    infoWindowData.office.state,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {infoWindowData.office.phone_number && (
                  <a
                    href={`tel:${infoWindowData.office.phone_number}`}
                    className="inline-flex items-center gap-1 text-sm text-fg-blue hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    Call
                  </a>
                )}

                {(infoWindowData.office.website_url || infoWindowData.program.website_url) && (
                  <a
                    href={infoWindowData.office.website_url || infoWindowData.program.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-fg-blue hover:underline"
                  >
                    <Globe className="w-3 h-3" />
                    Website
                  </a>
                )}

                <button
                  onClick={() => onProgramSelect?.(infoWindowData.program.id)}
                  className="inline-flex items-center gap-1 text-sm text-fg-blue hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Details
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
