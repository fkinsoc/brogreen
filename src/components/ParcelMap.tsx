import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Parcel } from "../lib/data";

function MarkerWithInfoWindow({ parcel }: { parcel: Parcel }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // Earth-grounded pigments (Zero Neon)
  const pinColor =
    parcel.riskLevel === "High"
      ? "#9c3c2b" // Terracotta Rust
      : parcel.riskLevel === "Medium"
      ? "#b87533" // Warm Ochre
      : "#346347"; // Forest Moss

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: parcel.lat, lng: parcel.lng }}
        title={`${parcel.id} · ${parcel.riskLevel} Risk`}
        onClick={() => setInfoWindowShown(true)}
      >
        <Pin
          background={pinColor}
          borderColor="#f7f5f0"
          glyphColor="#ffffff"
          scale={0.85}
        />
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setInfoWindowShown(false)}
          pixelOffset={[0, -5]}
        >
          <div className="text-[#1e1b18] p-1.5 font-sans min-w-[170px]">
            <div className="flex items-center justify-between gap-2 border-b border-[#ded7cb] pb-1 mb-1.5">
              <span className="font-mono font-bold text-xs text-[#244231]">
                {parcel.id}
              </span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  parcel.riskLevel === "High"
                    ? "bg-[#fbf0ee] text-[#9c3c2b]"
                    : parcel.riskLevel === "Medium"
                    ? "bg-[#fdf6ec] text-[#996328]"
                    : "bg-[#eef5f0] text-[#285739]"
                }`}
              >
                {parcel.riskLevel}
              </span>
            </div>
            <p className="text-xs mb-0.5">
              <strong className="text-[#685f52]">Owner:</strong> {parcel.landOwner}
            </p>
            <p className="text-xs mb-0.5">
              <strong className="text-[#685f52]">Survey:</strong> {parcel.surveyNumber} ({parcel.areaAcres} ac)
            </p>
            <p className="text-xs">
              <strong className="text-[#685f52]">Milestone:</strong> {parcel.currentAcquisitionStage}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function ParcelMap({
  parcel,
  allParcels,
}: {
  parcel?: Parcel;
  allParcels?: Parcel[];
}) {
  const [mounted, setMounted] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [loadingKey, setLoadingKey] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetch("/api/config/maps")
      .then((res) => res.json())
      .then((data) => {
        setApiKey(data.apiKey || "");
        setLoadingKey(false);
      })
      .catch(() => setLoadingKey(false));
  }, []);

  if (!mounted || loadingKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f4f1ea] dark:bg-[#121814]">
        <div className="w-7 h-7 border-2 border-[#2d4e3a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#f7f5f0] dark:bg-[#141b16] border border-[#ded7cb] dark:border-[#27352b] p-6 text-center rounded-lg">
        <h3 className="font-serif text-sm font-semibold text-[#1e1b18] dark:text-[#ece7dd] mb-1">
          Google Maps Demo Key Not Set
        </h3>
        <p className="text-xs text-[#6e6659] dark:text-[#9ea89f] mb-3 max-w-sm">
          Provide <code className="font-mono">VITE_GOOGLE_MAPS_API_KEY</code> to enable live satellite mapping.
        </p>
        <a
          href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 bg-[#244231] hover:bg-[#1b3527] text-[#f7f5f0] text-xs font-medium rounded transition-colors shadow-xs"
        >
          Acquire Demo Maps Key
        </a>
      </div>
    );
  }

  // Single parcel mode
  if (parcel) {
    return (
      <APIProvider apiKey={apiKey}>
        <div style={{ height: "100%", width: "100%" }}>
          <Map
            defaultCenter={{ lat: parcel.lat, lng: parcel.lng }}
            defaultZoom={14}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          >
            <MarkerWithInfoWindow parcel={parcel} />
          </Map>
        </div>
      </APIProvider>
    );
  }

  // Multi-parcel mode
  if (allParcels && allParcels.length > 0) {
    const centerLat =
      allParcels.reduce((sum, p) => sum + p.lat, 0) / allParcels.length;
    const centerLng =
      allParcels.reduce((sum, p) => sum + p.lng, 0) / allParcels.length;
    return (
      <APIProvider apiKey={apiKey}>
        <div style={{ height: "100%", width: "100%" }}>
          <Map
            defaultCenter={{ lat: centerLat, lng: centerLng }}
            defaultZoom={11}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          >
            {allParcels.map((p) => (
              <MarkerWithInfoWindow key={p.id} parcel={p} />
            ))}
          </Map>
        </div>
      </APIProvider>
    );
  }

  return null;
}
