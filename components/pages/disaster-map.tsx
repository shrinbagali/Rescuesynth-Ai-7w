"use client";

import { useEffect, useState } from "react";
import { Globe, Info } from "lucide-react";
import { historicalDisasters } from "@/lib/data";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export function DisasterMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getMarkerColor = (damageLevel: number) => {
    if (damageLevel >= 80) return "#ef4444";
    if (damageLevel >= 60) return "#f59e0b";
    return "#14b8a6";
  };

  const getMarkerRadius = (populationAffected: number) => {
    return Math.min(30, Math.max(10, populationAffected / 500000));
  };

  if (!mounted) {
    return (
      <div className="p-6 animate-fade-in">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Globe className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Global Disaster Intelligence Map</h3>
          </div>
          <div className="h-[600px] flex items-center justify-center bg-background">
            <div className="text-center">
              <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-400">Loading map...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Global Disaster Intelligence Map</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-red" />
              <span className="text-slate-400">Severe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-amber" />
              <span className="text-slate-400">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-teal" />
              <span className="text-slate-400">Low</span>
            </div>
          </div>
        </div>

        <div className="h-[600px]">
          <MapContainer
            center={[22.5, 82.5]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {historicalDisasters.map((disaster) => (
              <CircleMarker
                key={disaster.id}
                center={[disaster.latitude, disaster.longitude]}
                radius={getMarkerRadius(disaster.populationAffected)}
                pathOptions={{
                  color: getMarkerColor(disaster.damageLevel),
                  fillColor: getMarkerColor(disaster.damageLevel),
                  fillOpacity: 0.6,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-slate-900 min-w-[200px]">
                    <h4 className="font-bold text-lg mb-2">{disaster.region}</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Type:</strong> {disaster.disasterType}</p>
                      <p><strong>Year:</strong> {disaster.year}</p>
                      <p><strong>Population Affected:</strong> {(disaster.populationAffected / 1000000).toFixed(2)}M</p>
                      <p><strong>Damage Level:</strong> {disaster.damageLevel}%</p>
                      {disaster.rainfallLevel > 0 && (
                        <p><strong>Rainfall:</strong> {disaster.rainfallLevel}mm</p>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="p-4 border-t border-border bg-background">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-neon-blue mt-0.5" />
            <p className="text-sm text-slate-400">
              Map displays historical disaster events from 2018-2023. Circle size indicates population affected,
              color indicates damage severity. Click on markers for detailed information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
