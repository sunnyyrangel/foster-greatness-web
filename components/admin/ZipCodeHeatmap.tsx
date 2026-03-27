'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ZipCodeHeatmapProps {
  data: Array<{ zip: string; count: number }>;
}

export default function ZipCodeHeatmap({ data }: ZipCodeHeatmapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>('loading');

  useEffect(() => {
    if (!mapContainer.current || data.length === 0) {
      setStatus('empty');
      return;
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setStatus('empty');
      return;
    }

    mapboxgl.accessToken = token;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5, 38.5],
      zoom: 3.2,
      attributionControl: false,
      interactive: true,
    });

    map.current = mapInstance;

    mapInstance.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    mapInstance.on('load', async () => {
      // Geocode all ZIPs in parallel using Mapbox geocoding API
      const results = await Promise.all(
        data.map(async (d) => {
          try {
            const res = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${d.zip}.json?country=us&types=postcode&access_token=${token}`
            );
            const json = await res.json();
            const center = json.features?.[0]?.center;
            if (center) {
              return { ...d, lng: center[0], lat: center[1] };
            }
          } catch {
            // Skip failed geocodes
          }
          return null;
        })
      );

      const geocoded = results.filter(Boolean) as Array<{
        zip: string;
        count: number;
        lng: number;
        lat: number;
      }>;

      if (geocoded.length === 0 || !map.current) {
        setStatus('empty');
        return;
      }

      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: geocoded.map((d) => ({
          type: 'Feature',
          properties: { count: d.count, zip: d.zip },
          geometry: {
            type: 'Point',
            coordinates: [d.lng, d.lat],
          },
        })),
      };

      mapInstance.addSource('zip-data', { type: 'geojson', data: geojson });

      // Heatmap layer
      mapInstance.addLayer({
        id: 'zip-heat',
        type: 'heatmap',
        source: 'zip-data',
        paint: {
          'heatmap-weight': [
            'interpolate', ['linear'], ['get', 'count'],
            0, 0,
            Math.max(...geocoded.map((d) => d.count)), 1,
          ],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.1, '#ddf3ff',
            0.3, '#7abad8',
            0.5, '#0067a2',
            0.7, '#fa8526',
            1, '#1a2949',
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 15, 9, 40],
          'heatmap-opacity': 0.8,
        },
      });

      // Circle layer for zoomed in view
      mapInstance.addLayer({
        id: 'zip-points',
        type: 'circle',
        source: 'zip-data',
        minzoom: 6,
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['get', 'count'],
            1, 6,
            Math.max(...geocoded.map((d) => d.count)), 20,
          ],
          'circle-color': '#0067a2',
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 1.5,
          'circle-opacity': 0.8,
        },
      });

      // Popup on hover
      const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

      mapInstance.on('mouseenter', 'zip-points', (e) => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = 'pointer';
        const feature = e.features?.[0];
        if (feature && feature.geometry.type === 'Point') {
          const coords = feature.geometry.coordinates.slice() as [number, number];
          const props = feature.properties;
          popup
            .setLngLat(coords)
            .setHTML(
              `<div style="font-family:system-ui;font-size:13px;padding:2px">
                <strong>ZIP ${props?.zip}</strong><br/>
                ${props?.count} searches
              </div>`
            )
            .addTo(map.current);
        }
      });

      mapInstance.on('mouseleave', 'zip-points', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });

      setStatus('ready');
    });

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, [data]);

  if (data.length === 0 || status === 'empty') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-fg-navy mb-4">Search Heatmap</h3>
        <p className="text-gray-400 text-sm">No ZIP code data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">Search Heatmap</h3>
      <div
        ref={mapContainer}
        className="w-full rounded-lg overflow-hidden"
        style={{ height: 320 }}
      />
    </div>
  );
}
