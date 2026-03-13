import React, { useState } from 'react';
import { MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { seismicRegions, calculateSeismicHazardIndex, SeismicZone } from '../data/seismicRegions';

export default function SeismicDataset() {
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const sortedZones = [...seismicRegions].sort(
    (a, b) => calculateSeismicHazardIndex(b) - calculateSeismicHazardIndex(a)
  );

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'Extreme':
        return 'text-red-400 bg-red-400 bg-opacity-10 border-red-500';
      case 'Very High':
        return 'text-orange-400 bg-orange-400 bg-opacity-10 border-orange-500';
      case 'High':
        return 'text-yellow-400 bg-yellow-400 bg-opacity-10 border-yellow-500';
      default:
        return 'text-green-400 bg-green-400 bg-opacity-10 border-green-500';
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <MapPin size={20} className="text-red-400" />
          Global Seismic Zones
        </h3>
        <span className="text-xs text-gray-400">{seismicRegions.length} zones monitored</span>
      </div>

      {/* Zones List */}
      <div className="space-y-2">
        {sortedZones.map((zone) => {
          const hazardIndex = calculateSeismicHazardIndex(zone);
          const isExpanded = expandedZone === zone.id;

          return (
            <div
              key={zone.id}
              className={`border rounded-lg overflow-hidden transition-all duration-300 ${getRiskColor(
                zone.riskLevel
              )}`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedZone(isExpanded ? null : zone.id)}
                className="w-full p-3 flex items-start justify-between hover:opacity-80 transition-opacity"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{zone.name}</p>
                    <span className="text-xs px-2 py-0.5 bg-opacity-30 rounded bg-current">
                      {zone.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{zone.country}</p>
                </div>

                {/* Hazard Index */}
                <div className="ml-2 text-right">
                  <p className="text-2xl font-bold">{hazardIndex}</p>
                  <p className="text-xs text-gray-400">Hazard Index</p>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-current border-opacity-30 p-3 bg-black bg-opacity-20 space-y-3">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Avg Magnitude</p>
                      <p className="text-lg font-bold text-white">{zone.averageMagnitude}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Frequency</p>
                      <p className="text-sm font-bold text-white">{zone.averageFrequency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Population Exposed</p>
                      <p className="text-sm font-bold text-orange-400">{formatNumber(zone.populationExposed)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Last Major Event</p>
                      <p className="text-lg font-bold text-white">{zone.lastMajorEvent}</p>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="text-xs">
                    <p className="text-gray-400 mb-1">Coordinates</p>
                    <p className="text-cyan-300 font-mono">
                      {zone.latitude.toFixed(4)}°, {zone.longitude.toFixed(4)}°
                    </p>
                  </div>

                  {/* Fault Lines */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <TrendingUp size={14} />
                      Active Fault Systems
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {zone.faultLines.map((fault, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-slate-700 rounded border border-slate-600"
                        >
                          {fault}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Characteristics */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <AlertTriangle size={14} />
                      Key Characteristics
                    </p>
                    <ul className="text-xs space-y-1">
                      {zone.characteristics.map((char, idx) => (
                        <li key={idx} className="text-gray-300 flex gap-2">
                          <span className="text-gray-500">•</span>
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hazard Breakdown */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400">Hazard Components</p>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Risk Level</span>
                        <div className="w-24 bg-slate-700 rounded h-2">
                          <div
                            className="bg-red-500 h-full rounded"
                            style={{
                              width:
                                zone.riskLevel === 'Extreme'
                                  ? '100%'
                                  : zone.riskLevel === 'Very High'
                                  ? '75%'
                                  : '50%',
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Magnitude Factor</span>
                        <div className="w-24 bg-slate-700 rounded h-2">
                          <div
                            className="bg-orange-500 h-full rounded"
                            style={{ width: `${Math.min((zone.averageMagnitude / 8.5) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Population Exposure</span>
                        <div className="w-24 bg-slate-700 rounded h-2">
                          <div
                            className="bg-yellow-500 h-full rounded"
                            style={{
                              width: `${Math.min((zone.populationExposed / 400000000) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-2 bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-3">
        <div>
          <p className="text-xs text-gray-400">Extreme Risk Zones</p>
          <p className="text-2xl font-bold text-red-400">
            {seismicRegions.filter((z) => z.riskLevel === 'Extreme').length}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Population at Risk</p>
          <p className="text-lg font-bold text-orange-400">
            {formatNumber(seismicRegions.reduce((sum, z) => sum + z.populationExposed, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}
