'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// ZIP code centroid approximations for common areas
// In production this uses the actual ZIP centroids from the data
const ZIP_COORDS: Record<string, [number, number]> = {
  // California
  '90011': [-118.258, 33.993], '90044': [-118.291, 33.952], '90003': [-118.273, 33.964],
  '90201': [-118.172, 33.977], '90006': [-118.293, 34.049], '90037': [-118.284, 33.980],
  '90026': [-118.261, 34.078], '90019': [-118.340, 34.048], '90004': [-118.310, 34.076],
  '90015': [-118.266, 34.039], '93706': [-119.817, 36.710], '95122': [-121.828, 37.330],
  '92114': [-117.056, 32.707], '94544': [-122.082, 37.633], '93307': [-119.045, 35.326],
  // Texas
  '77084': [-95.656, 29.829], '77036': [-95.536, 29.700], '75217': [-96.661, 32.713],
  '78521': [-97.456, 25.960], '77449': [-95.733, 29.803], '75211': [-96.875, 32.738],
  '79936': [-106.320, 31.770], '78572': [-98.210, 26.227],
  // Illinois
  '60629': [-87.696, 41.778], '60639': [-87.758, 41.922], '60618': [-87.713, 41.947],
  '60617': [-87.556, 41.717], '60632': [-87.704, 41.810],
  // Georgia
  '30318': [-84.432, 33.790], '30310': [-84.423, 33.728], '30344': [-84.450, 33.690],
  '30349': [-84.461, 33.617], '30312': [-84.376, 33.741],
  // Arizona
  '85281': [-111.925, 33.415], '85033': [-112.152, 33.494], '85035': [-111.987, 33.452],
  '85301': [-112.185, 33.531],
  // North Carolina
  '28208': [-80.905, 35.232], '28205': [-80.790, 35.234], '28212': [-80.744, 35.182],
  // Pennsylvania
  '19132': [-75.168, 40.008], '19134': [-75.100, 39.993], '19140': [-75.142, 40.032],
  // Michigan
  '48228': [-83.212, 42.350], '48227': [-83.188, 42.388], '48235': [-83.193, 42.417],
  // New York
  '10456': [-73.908, 40.831], '11212': [-73.913, 40.663], '10467': [-73.871, 40.874],
  '11226': [-73.957, 40.646],
  // Florida
  '33012': [-80.310, 25.865], '33142': [-80.236, 25.814], '33054': [-80.250, 25.907],
  '32210': [-81.738, 30.283],
  // Ohio
  '44105': [-81.630, 41.444], '43207': [-82.962, 39.912],
  // Washington
  '98003': [-122.313, 47.309], '98168': [-122.297, 47.489],
  // Oregon
  '97233': [-122.497, 45.517],
  // Nevada
  '89101': [-115.142, 36.173],
  // Colorado
  '80219': [-105.027, 39.680],
};

interface ZipCodeHeatmapProps {
  data: Array<{ zip: string; count: number }>;
}

export default function ZipCodeHeatmap({ data }: ZipCodeHeatmapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5, 38.5],
      zoom: 3.2,
      attributionControl: false,
      interactive: true,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current || data.length === 0) return;

    // Build GeoJSON from ZIP data
    const features = data
      .filter((d) => ZIP_COORDS[d.zip])
      .map((d) => ({
        type: 'Feature' as const,
        properties: { count: d.count, zip: d.zip },
        geometry: {
          type: 'Point' as const,
          coordinates: ZIP_COORDS[d.zip],
        },
      }));

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };

    // Remove existing layers/sources if re-rendering
    if (map.current.getLayer('zip-heat')) map.current.removeLayer('zip-heat');
    if (map.current.getLayer('zip-points')) map.current.removeLayer('zip-points');
    if (map.current.getSource('zip-data')) map.current.removeSource('zip-data');

    map.current.addSource('zip-data', { type: 'geojson', data: geojson });

    // Heatmap layer
    map.current.addLayer({
      id: 'zip-heat',
      type: 'heatmap',
      source: 'zip-data',
      paint: {
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'count'], 0, 0, 200, 1],
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
    map.current.addLayer({
      id: 'zip-points',
      type: 'circle',
      source: 'zip-data',
      minzoom: 6,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 10, 6, 200, 20],
        'circle-color': '#0067a2',
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 1.5,
        'circle-opacity': 0.8,
      },
    });

    // Popup on hover
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

    map.current.on('mouseenter', 'zip-points', (e) => {
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

    map.current.on('mouseleave', 'zip-points', () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = '';
      popup.remove();
    });
  }, [mapLoaded, data]);

  if (data.length === 0) {
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
