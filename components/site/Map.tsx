'use client';

import React from 'react';

export default function Map() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '260px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
      }}
    >
      <iframe
        title="Edex Edupark, Kochi, Kerala Location Map"
        src="https://www.google.com/maps?q=Edex+Edupark,+Kochi,+Kerala&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0, display: 'block' }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}