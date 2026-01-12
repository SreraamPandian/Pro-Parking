// Helper function to generate license plate SVG data URL (Version 2: Premium Design)
export const generateLicensePlateImage = (plateNumber) => {
  // Random US state abbreviations
  const usStates = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI', 'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT'];
  const randomState = usStates[Math.floor(Math.random() * usStates.length)];

  const svg = `
    <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Base Plate -->
      <rect width="400" height="100" rx="10" fill="#2d3748" />
      <rect x="3" y="3" width="394" height="94" rx="8" fill="url(#plateGrad)" stroke="#cbd5e0" stroke-width="1"/>
      
      <!-- Side Strip (Regional Style) -->
      <path d="M3 11C3 6.58172 6.58172 3 11 3H45V97H11C6.58172 97 3 93.4183 3 89V11Z" fill="#1e40af" />
      <circle cx="24" cy="35" r="10" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
      <text x="24" y="75" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="white">${randomState}</text>
      
      <!-- License Plate Number -->
      <text x="225" y="68" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="52" font-weight="900" text-anchor="middle" fill="#000000" letter-spacing="3" style="text-transform: uppercase;">
        ${plateNumber}
      </text>
      
      <!-- Plate Texture/Shine -->
      <rect x="3" y="3" width="394" height="30" fill="white" fill-opacity="0.1" rx="8" />
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
