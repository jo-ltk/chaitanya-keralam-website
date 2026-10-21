/* Map component for Edex Edupark, Kochi */
'use client';

import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

L.Icon.Default.prototype._getIconUrl = function (className) {
  return 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
};

export default function Map() {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    // Wait for Leaflet to be ready
    const loadLeaflet = () => {
      mapRef.current = L.map(mapRef.current!.container).setView([9.9655, 76.2858], 15); // Kochi coordinates

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current!);

      // Edex Edupark marker
      L.marker([9.9655, 76.2858])
        .addTo(mapRef.current!)
        .bindPopup('<b>Edex Edupark</b><br />Kochi, Kerala')
        .openPopup();
    };

    // Load Leaflet CSS and initialize
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha512-p4NFkBKj+cTZYiYisoRP7Nmo7eZd3G8PG36RzbNQ/JR9XlII6NlNEGocb8itifwAz2p/oBg2aRw8mLlDY surroundinga7I1RKHgQj86+vJSwg5vF4tTQZjzYw8BT8wDz6J4MmDw07JWMhLlQoWiwAK/UKCE6kGxOSnyI67I3543GmXZKzZ1M2CZQ5zD9zS5UMHUhlSAHJ4JDiQ3mFgMZpJ2S5A3kMZwfZ7ow5XZsG7TA1dKHlMyfMJ8c67GkLsW4C881IAxTjmnhZkl3qkn1mWTtAWfefZ3HB8c42==';
    link.crossOrigin = '';

    document.head.appendChild(link);

    // Initialize after a slight delay to ensure DOM is ready
    const timeoutId = setTimeout(loadLeaflet, 100);

    return () => {
      clearTimeout(timeoutId);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} style={{ height: '250px', width: '100%' }} />;
}