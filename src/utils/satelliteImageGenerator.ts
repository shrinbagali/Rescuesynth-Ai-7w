import { DisasterType } from '../types';

/**
 * Generate satellite-style images for disasters using Canvas API
 */
export function generateSatelliteImage(
  canvas: HTMLCanvasElement,
  disasterType: DisasterType,
  intensity: number = 0.5 // 0-1 scale
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Create base satellite background
  createBaseBackground(ctx, width, height);

  // Generate disaster-specific visualization
  switch (disasterType) {
    case 'Cyclone':
      generateCycloneImage(ctx, width, height, intensity);
      break;
    case 'Earthquake':
      generateEarthquakeImage(ctx, width, height, intensity);
      break;
    case 'Flood':
      generateFloodImage(ctx, width, height, intensity);
      break;
    case 'Wildfire':
      generateWildfireImage(ctx, width, height, intensity);
      break;
    case 'Landslide':
      generateLandslideImage(ctx, width, height, intensity);
      break;
  }
}

/**
 * Create base satellite background
 */
function createBaseBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // Gradient base - dark ocean/land
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a1f35');
  gradient.addColorStop(0.5, '#2d3b5c');
  gradient.addColorStop(1, '#1a1f35');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add subtle noise
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 10;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Generate cyclone visualization
 */
function generateCycloneImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2;

  // Draw spiral bands
  const rings = 8;
  for (let ring = rings; ring > 0; ring--) {
    const radius = (ring / rings) * maxRadius * intensity;
    const opacity = (1 - ring / rings) * 0.6 + 0.1;

    // Cyclone spiral - alternating colors
    ctx.strokeStyle = ring % 2 === 0
      ? `rgba(100, 150, 255, ${opacity})`
      : `rgba(150, 180, 255, ${opacity})`;
    ctx.lineWidth = 3;
    ctx.beginPath();

    // Draw spiral spiral
    const points = 100;
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const r = radius * (i / points);
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Draw eye of cyclone
  const eyeRadius = 30 * intensity;
  const eyeGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, eyeRadius);
  eyeGradient.addColorStop(0, 'rgba(200, 200, 200, 0.3)');
  eyeGradient.addColorStop(1, 'rgba(100, 120, 150, 0.1)');
  ctx.fillStyle = eyeGradient;
  ctx.fillRect(centerX - eyeRadius, centerY - eyeRadius, eyeRadius * 2, eyeRadius * 2);

  // Add wind direction indicators
  const windCount = 12;
  for (let i = 0; i < windCount; i++) {
    const angle = (i / windCount) * Math.PI * 2;
    const distance = maxRadius * 0.7;
    const startX = centerX + distance * Math.cos(angle);
    const startY = centerY + distance * Math.sin(angle);
    const length = 30 * intensity;
    const endX = startX + length * Math.cos(angle);
    const endY = startY + length * Math.sin(angle);

    ctx.strokeStyle = `rgba(255, 200, 100, ${0.4 * intensity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}

/**
 * Generate earthquake visualization
 */
function generateEarthquakeImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw epicenter point
  ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Draw concentric ripples (seismic waves)
  const ripples = 10;
  for (let i = 1; i <= ripples; i++) {
    const progress = (i / ripples) * intensity;
    const radius = progress * Math.min(width, height) * 0.4;
    const opacity = (1 - progress) * 0.5;

    // Primary wave
    ctx.strokeStyle = `rgba(255, 150, 100, ${opacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Secondary wave
    if (i > 2) {
      ctx.strokeStyle = `rgba(150, 200, 255, ${opacity * 0.5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.85, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Add fault line visualization
  const faultCount = 3;
  for (let f = 0; f < faultCount; f++) {
    const angle = (f / faultCount) * Math.PI * 2;
    const distance = Math.min(width, height) * 0.25;
    
    ctx.strokeStyle = `rgba(200, 100, 100, ${0.3 * intensity})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    const x1 = centerX + distance * Math.cos(angle);
    const y1 = centerY + distance * Math.sin(angle);
    const x2 = centerX - distance * Math.cos(angle);
    const y2 = centerY - distance * Math.sin(angle);
    
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Add ground displacement indicators
  const displacementCount = 8;
  for (let i = 0; i < displacementCount; i++) {
    const angle = (i / displacementCount) * Math.PI * 2;
    const distance = Math.min(width, height) * 0.3;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    const size = 4;

    ctx.fillStyle = `rgba(255, 200, 100, ${0.5 * intensity})`;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  }
}

/**
 * Generate flood visualization
 */
function generateFloodImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  // Water levels with gradient
  const waterHeight = height * intensity;
  const waterGradient = ctx.createLinearGradient(0, 0, width, height);
  waterGradient.addColorStop(0, 'rgba(20, 80, 150, 0.2)');
  waterGradient.addColorStop(0.3, 'rgba(30, 100, 180, 0.4)');
  waterGradient.addColorStop(0.7, 'rgba(50, 130, 200, 0.6)');
  waterGradient.addColorStop(1, 'rgba(80, 150, 220, 0.8)');

  ctx.fillStyle = waterGradient;
  ctx.fillRect(0, height - waterHeight, width, waterHeight);

  // Add flow patterns (river-like)
  for (let i = 0; i < 5; i++) {
    const yPos = height - waterHeight + (i * waterHeight / 5);
    ctx.strokeStyle = `rgba(100, 180, 255, ${0.3 * intensity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < width; x += 20) {
      const wave = Math.sin((x / width) * Math.PI * 3 + i * 0.5) * 5;
      if (x === 0) ctx.moveTo(x, yPos + wave);
      else ctx.lineTo(x, yPos + wave);
    }
    ctx.stroke();
  }

  // Add elevated water zones (accumulation areas)
  const zones = 4;
  for (let z = 0; z < zones; z++) {
    const x = (z + 0.5) * (width / zones);
    const y = height - waterHeight + 20;
    const radius = 50 * intensity;

    const zoneGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    zoneGradient.addColorStop(0, `rgba(150, 200, 255, ${0.4 * intensity})`);
    zoneGradient.addColorStop(1, `rgba(100, 150, 200, 0.1)`);

    ctx.fillStyle = zoneGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add wave indicators
  const waveCount = 6;
  for (let w = 0; w < waveCount; w++) {
    const y = height - waterHeight + w * 10;
    ctx.strokeStyle = `rgba(200, 220, 255, ${0.2 * intensity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x < width; x += 30) {
      const wave = Math.sin((x / width) * Math.PI * 2 - w * 0.3) * 3;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
}

/**
 * Generate wildfire visualization
 */
function generateWildfireImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  // Thermal heatmap
  const heatmapGradient = ctx.createLinearGradient(0, 0, width, height);
  heatmapGradient.addColorStop(0, 'rgba(50, 50, 80, 0.3)');
  heatmapGradient.addColorStop(0.3, 'rgba(200, 100, 50, 0.4)');
  heatmapGradient.addColorStop(0.6, 'rgba(255, 150, 50, 0.6)');
  heatmapGradient.addColorStop(1, 'rgba(255, 80, 0, 0.8)');

  ctx.fillStyle = heatmapGradient;
  ctx.fillRect(0, 0, width, height);

  // Fire hotspots
  const hotspots = 8;
  for (let h = 0; h < hotspots; h++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 40 + Math.random() * 60;

    const fireGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    fireGradient.addColorStop(0, `rgba(255, 200, 100, ${0.7 * intensity})`);
    fireGradient.addColorStop(0.5, `rgba(255, 100, 50, ${0.4 * intensity})`);
    fireGradient.addColorStop(1, `rgba(200, 50, 0, 0.1)`);

    ctx.fillStyle = fireGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Smoke plumes
  const plumes = 5;
  for (let p = 0; p < plumes; p++) {
    const baseX = (p + 0.5) * (width / plumes);
    const baseY = height * 0.7;

    for (let layer = 0; layer < 5; layer++) {
      const y = baseY - layer * 30 * intensity;
      const width_ = 50 + layer * 20;
      const opacity = (0.3 * intensity) / (layer + 1);

      ctx.fillStyle = `rgba(150, 150, 150, ${opacity})`;
      ctx.beginPath();
      ctx.ellipse(baseX, y, width_ / 2, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Wind direction indicators
  const windLines = 6;
  for (let w = 0; w < windLines; w++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = 30 * intensity;

    ctx.strokeStyle = `rgba(255, 150, 50, ${0.3 * intensity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.stroke();
  }
}

/**
 * Generate landslide visualization
 */
function generateLandslideImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  // Draw unstable slopes
  const slopeCount = 4;
  for (let s = 0; s < slopeCount; s++) {
    const x1 = (s * width) / slopeCount;
    const x2 = ((s + 1) * width) / slopeCount;
    const y1 = height * 0.3;
    const y2 = height * 0.8;

    // Slope gradient
    const slopeGradient = ctx.createLinearGradient(x1, y1, x2, y2);
    slopeGradient.addColorStop(0, 'rgba(100, 80, 60, 0.3)');
    slopeGradient.addColorStop(0.5, `rgba(150, 100, 80, ${0.4 * intensity})`);
    slopeGradient.addColorStop(1, `rgba(180, 120, 80, ${0.6 * intensity})`);

    ctx.fillStyle = slopeGradient;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2, height);
    ctx.lineTo(x1, height);
    ctx.fill();
  }

  // Debris flows
  const flows = 5;
  for (let f = 0; f < flows; f++) {
    const startX = (f + 0.5) * (width / flows);
    const startY = height * 0.3;

    ctx.fillStyle = `rgba(200, 150, 100, ${0.4 * intensity})`;
    ctx.beginPath();
    
    for (let y = startY; y < height; y += 20) {
      const offset = Math.sin(y / 50) * 30 * intensity;
      const x = startX + offset;
      const pointHeight = 15;
      const pointWidth = 40 * intensity;

      ctx.fillRect(x - pointWidth / 2, y, pointWidth, pointHeight);
    }
  }

  // Ground cracks
  const cracks = 6;
  for (let c = 0; c < cracks; c++) {
    const x = Math.random() * width;
    const y = Math.random() * height * 0.7;
    const crackLength = 60 * intensity;

    ctx.strokeStyle = `rgba(150, 100, 80, ${0.5 * intensity})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + crackLength, y + 30 * intensity);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Collapse indicators
  const collapses = 4;
  for (let col = 0; col < collapses; col++) {
    const x = Math.random() * width;
    const y = height * 0.4 + Math.random() * (height * 0.4);
    const radius = 30 * intensity;

    const collapseGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    collapseGradient.addColorStop(0, `rgba(180, 100, 80, ${0.4 * intensity})`);
    collapseGradient.addColorStop(1, `rgba(100, 80, 60, 0.1)`);

    ctx.fillStyle = collapseGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
