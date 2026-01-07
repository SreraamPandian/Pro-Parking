// Helper function to generate license plate SVG data URL
export const generateLicensePlateImage = (plateNumber) => {
    const svg = `
    <svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="100" fill="#1E40AF" rx="8"/>
      <rect x="5" y="5" width="290" height="90" fill="white" rx="5"/>
      <text x="150" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="#1E40AF">
        ${plateNumber}
      </text>
    </svg>
  `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
};
