import React, { useEffect, useRef } from 'react';
import { DisasterType } from '../types';
import { generateSatelliteImage } from '../utils/satelliteImageGenerator';

interface DisasterImageViewerProps {
  disasterType: DisasterType;
  intensity: number; // 0-1 scale
  width?: number;
  height?: number;
  className?: string;
}

export default function DisasterImageViewer({
  disasterType,
  intensity,
  width = 500,
  height = 500,
  className = '',
}: DisasterImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    generateSatelliteImage(canvas, disasterType, intensity);
  }, [disasterType, intensity, width, height]);

  const getDisasterLabel = (type: DisasterType): string => {
    switch (type) {
      case 'Cyclone':
        return 'Cyclone Formation';
      case 'Earthquake':
        return 'Seismic Activity';
      case 'Flood':
        return 'Water Accumulation';
      case 'Wildfire':
        return 'Thermal Hotspots';
      case 'Landslide':
        return 'Slope Instability';
    }
  };

  const getDisasterColor = (type: DisasterType): string => {
    switch (type) {
      case 'Cyclone':
        return 'from-blue-500 to-cyan-500';
      case 'Earthquake':
        return 'from-amber-500 to-red-500';
      case 'Flood':
        return 'from-blue-400 to-blue-600';
      case 'Wildfire':
        return 'from-orange-500 to-red-500';
      case 'Landslide':
        return 'from-amber-700 to-amber-900';
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-full">
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${getDisasterColor(disasterType)} rounded-lg blur opacity-25`}></div>
        <div className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ background: '#0f172a' }}
          />
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-white">
          {getDisasterLabel(disasterType)}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Satellite Image Analysis
        </p>
      </div>

      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getDisasterColor(disasterType)}`}></div>
          <span className="text-xs text-slate-300">
            Intensity: {Math.round(intensity * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
