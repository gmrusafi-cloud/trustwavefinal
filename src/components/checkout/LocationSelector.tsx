"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {
  MapPin,
  Search,
  Crosshair,
  Check,
  ChevronDown,
  Info,
  Globe,
  Building2,
  Map as MapIcon,
  Sparkles,
  Store,
  Navigation,
} from "lucide-react";

// Rangpur Sadar Neighborhoods (Store Base Region)
const RANGPUR_SADAR_NEIGHBORHOODS = [
  {
    id: "dhap-lalkuthi",
    name: "Dhap Lalkuthi",
    landmark: "Main Store Hub Area",
    postal: "5400",
    lat: 25.753,
    lng: 89.245,
    isHub: true,
  },
  {
    id: "dhap-medical-gate",
    name: "Dhap Medical East Gate",
    landmark: "Rangpur Medical College Hospital",
    postal: "5400",
    lat: 25.7515,
    lng: 89.2432,
    isHub: false,
  },
  {
    id: "jahaz-company",
    name: "Jahaz Company More",
    landmark: "City Center / Commercial Hub",
    postal: "5400",
    lat: 25.746,
    lng: 89.252,
    isHub: false,
  },
  {
    id: "rk-road",
    name: "RK Road",
    landmark: "Radhaballabh & Station Connector",
    postal: "5400",
    lat: 25.758,
    lng: 89.241,
    isHub: false,
  },
  {
    id: "park-mode-brur",
    name: "Park Mode (BRUR Area)",
    landmark: "Begum Rokeya University Gate",
    postal: "5402",
    lat: 25.728,
    lng: 89.263,
    isHub: false,
  },
  {
    id: "lalbagh",
    name: "Lalbagh Bazaar",
    landmark: "Lalbagh Rail Gate & Market",
    postal: "5402",
    lat: 25.735,
    lng: 89.26,
    isHub: false,
  },
  {
    id: "carmichael",
    name: "Carmichael College Area",
    landmark: "College Campus & Student Mess",
    postal: "5402",
    lat: 25.731,
    lng: 89.258,
    isHub: false,
  },
  {
    id: "shalbon",
    name: "Shalbon Mistripara",
    landmark: "Shalbon Bazaar Area",
    postal: "5400",
    lat: 25.748,
    lng: 89.261,
    isHub: false,
  },
  {
    id: "guptapara-senpara",
    name: "Guptapara & Senpara",
    landmark: "Residential Sadar Zone",
    postal: "5400",
    lat: 25.744,
    lng: 89.25,
    isHub: false,
  },
  {
    id: "terminal-road",
    name: "Central Bus Terminal Area",
    landmark: "Rangpur Terminal",
    postal: "5400",
    lat: 25.738,
    lng: 89.239,
    isHub: false,
  },
  {
    id: "modern-mode",
    name: "Modern Mode",
    landmark: "Dhaka-Rangpur Highway Crossing",
    postal: "5400",
    lat: 25.715,
    lng: 89.268,
    isHub: false,
  },
  {
    id: "station-road",
    name: "Station Road & Kermatia",
    landmark: "Rangpur Railway Station Area",
    postal: "5400",
    lat: 25.742,
    lng: 89.256,
    isHub: false,
  },
];

// Common Bangladesh Divisions and Cities for Quick Selection
const BANGLADESH_LOCATIONS = [
  { name: "Dhaka", division: "Dhaka", postal: "1200", lat: 23.8103, lng: 90.4125 },
  { name: "Gulshan, Dhaka", division: "Dhaka", postal: "1212", lat: 23.7925, lng: 90.4078 },
  { name: "Dhanmondi, Dhaka", division: "Dhaka", postal: "1205", lat: 23.7461, lng: 90.3742 },
  { name: "Uttara, Dhaka", division: "Dhaka", postal: "1230", lat: 23.8759, lng: 90.3795 },
  { name: "Chittagong", division: "Chittagong", postal: "4000", lat: 22.3569, lng: 91.7832 },
  { name: "Sylhet", division: "Sylhet", postal: "3100", lat: 24.8949, lng: 91.8687 },
  { name: "Rajshahi", division: "Rajshahi", postal: "6000", lat: 24.3745, lng: 88.6042 },
  { name: "Khulna", division: "Khulna", postal: "9100", lat: 22.8456, lng: 89.5403 },
  { name: "Barisal", division: "Barisal", postal: "8200", lat: 22.7010, lng: 90.3535 },
  { name: "Rangpur Sadar", division: "Rangpur", postal: "5400", lat: 25.7439, lng: 89.2752 },
  { name: "Mymensingh", division: "Mymensingh", postal: "2200", lat: 24.7471, lng: 90.4203 },
  { name: "Comilla", division: "Chittagong", postal: "3500", lat: 23.4607, lng: 91.1809 },
];

interface LocationSelectorProps {
  currentAddress: string;
  currentCity: string;
  currentPostalCode: string;
  onSelectLocation: (data: {
    address: string;
    city: string;
    postalCode: string;
    lat?: number;
    lng?: number;
  }) => void;
}

// Inner Map Controller component using Google Maps JS SDK hooks
function MapLocationPickerContent({
  position,
  setPosition,
  onAddressResolved,
}: {
  position: { lat: number; lng: number };
  setPosition: (pos: { lat: number; lng: number }) => void;
  onAddressResolved: (data: { address: string; city: string; postalCode: string }) => void;
}) {
  const map = useMap();
  const geocodingLib = useMapsLibrary("geocoding");
  const placesLib = useMapsLibrary("places");
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const autocompleteServiceRef = useRef<any>(null);

  // Initialize Places Autocomplete service
  useEffect(() => {
    if (placesLib && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new placesLib.AutocompleteService();
    }
  }, [placesLib]);

  // Reverse geocode when position changes
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      if (!geocodingLib) return;
      setGeocodingLoading(true);
      try {
        const geocoder = new geocodingLib.Geocoder();
        const response = await geocoder.geocode({ location: { lat, lng } });
        if (response.results && response.results[0]) {
          const result = response.results[0];
          let city = "";
          let postalCode = "";
          const address = result.formatted_address || "";

          for (const component of result.address_components) {
            if (component.types.includes("locality") || component.types.includes("administrative_area_level_2")) {
              city = component.long_name;
            } else if (!city && component.types.includes("administrative_area_level_1")) {
              city = component.long_name;
            }
            if (component.types.includes("postal_code")) {
              postalCode = component.long_name;
            }
          }

          if (!city) city = "Rangpur";

          onAddressResolved({ address, city, postalCode });
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
      } finally {
        setGeocodingLoading(false);
      }
    },
    [geocodingLib, onAddressResolved]
  );

  // Update map center when position prop changes
  useEffect(() => {
    if (map) {
      map.panTo(position);
    }
  }, [map, position]);

  // Handle map click to drop pin
  const handleMapClick = (e: any) => {
    if (e.detail && e.detail.latLng) {
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      const newPos = { lat, lng };
      setPosition(newPos);
      reverseGeocode(lat, lng);
    }
  };

  // Search autocomplete query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val || val.length < 2 || !autocompleteServiceRef.current) {
      setSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: val,
        componentRestrictions: { country: "bd" }, // Bangladesh bias
      },
      (predictions: any[], status: any) => {
        if (status === "OK" && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  // Select place prediction
  const handleSelectPrediction = async (prediction: any) => {
    setSearchQuery(prediction.description);
    setSuggestions([]);
    if (!geocodingLib) return;

    try {
      const geocoder = new geocodingLib.Geocoder();
      const response = await geocoder.geocode({ placeId: prediction.place_id });
      if (response.results && response.results[0]) {
        const res = response.results[0];
        const location = res.geometry.location;
        const newPos = { lat: location.lat(), lng: location.lng() };
        setPosition(newPos);
        if (map) {
          map.panTo(newPos);
          map.setZoom(16);
        }

        let city = "";
        let postalCode = "";
        for (const component of res.address_components) {
          if (component.types.includes("locality") || component.types.includes("administrative_area_level_2")) {
            city = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            postalCode = component.long_name;
          }
        }

        onAddressResolved({
          address: res.formatted_address,
          city: city || "Rangpur",
          postalCode: postalCode || "",
        });
      }
    } catch (err) {
      console.error("Place lookup failed:", err);
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10">
        <div className="relative">
          <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <Search className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Dhap, Lalkuthi, or any location in Bangladesh..."
              className="w-full px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            {geocodingLoading && (
              <div className="pr-3">
                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 max-h-56 overflow-y-auto">
              {suggestions.map((item) => (
                <button
                  key={item.place_id}
                  type="button"
                  onClick={() => handleSelectPrediction(item)}
                  className="w-full text-left px-4 py-2.5 hover:bg-brand-50 border-b border-gray-50 last:border-0 flex items-start gap-2.5 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{item.structured_formatting.main_text}</p>
                    <p className="text-[11px] text-gray-500">{item.structured_formatting.secondary_text}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map */}
      <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-gray-200 relative">
        <Map
          defaultCenter={position}
          defaultZoom={14}
          mapId="DEMO_MAP_ID"
          onClick={handleMapClick}
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          style={{ width: "100%", height: "100%" }}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <AdvancedMarker position={position}>
            <Pin background="#2563eb" glyphColor="#ffffff" borderColor="#1e40af" />
          </AdvancedMarker>
        </Map>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
        <Info className="w-3.5 h-3.5 text-brand-600" /> Click anywhere on map or drag pin to fine-tune delivery location
      </p>
    </div>
  );
}

export default function LocationSelector({
  currentAddress,
  currentCity,
  currentPostalCode,
  onSelectLocation,
}: LocationSelectorProps) {
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLATFORM_KEY ||
    process.env.GOOGLE_MAPS_PLATFORM_KEY ||
    "";
  const hasValidKey = Boolean(apiKey) && apiKey !== "YOUR_API_KEY";

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"rangpur" | "preset" | "map">("rangpur");
  const [selectedPos, setSelectedPos] = useState({ lat: 25.753, lng: 89.245 }); // Default: Dhap Lalkuthi, Rangpur Sadar
  const [geoLocating, setGeoLocating] = useState(false);
  const [selectedRangpurHood, setSelectedRangpurHood] = useState<string>("dhap-lalkuthi");

  const [tempData, setTempData] = useState({
    address: "",
    city: "",
    postalCode: "",
  });

  const displayAddress = currentAddress || tempData.address;
  const displayCity = currentCity || tempData.city;

  // Auto-detect browser location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setSelectedPos({ lat, lng });
        setGeoLocating(false);
        setActiveTab("map");
        setIsOpen(true);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              const addr = data.display_name || "";
              const city =
                data.address?.city ||
                data.address?.town ||
                data.address?.state_district ||
                "Rangpur";
              const postcode = data.address?.postcode || "5400";

              const resolved = { address: addr, city, postalCode: postcode, lat, lng };
              setTempData(resolved);
              onSelectLocation(resolved);
            }
          })
          .catch(() => {
            const fallback = {
              address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
              city: "Rangpur",
              postalCode: "5400",
              lat,
              lng,
            };
            setTempData(fallback);
            onSelectLocation(fallback);
          });
      },
      () => {
        setGeoLocating(false);
        alert("Unable to retrieve your location. Please check browser permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectRangpurHood = (hood: typeof RANGPUR_SADAR_NEIGHBORHOODS[0]) => {
    setSelectedRangpurHood(hood.id);
    const data = {
      address: `${hood.name}, Sadar`,
      city: "Rangpur",
      postalCode: hood.postal,
      lat: hood.lat,
      lng: hood.lng,
    };
    setSelectedPos({ lat: hood.lat, lng: hood.lng });
    setTempData(data);
    onSelectLocation(data);
  };

  const handleSelectPreset = (loc: typeof BANGLADESH_LOCATIONS[0]) => {
    const data = {
      address: `${loc.name}, ${loc.division}`,
      city: loc.name.split(",")[0].trim(),
      postalCode: loc.postal,
      lat: loc.lat,
      lng: loc.lng,
    };
    setSelectedPos({ lat: loc.lat, lng: loc.lng });
    setTempData(data);
    onSelectLocation(data);
  };

  return (
    <div className="LocationSelector space-y-3">
      {/* Location Selector Header Bar */}
      <div className="p-3.5 bg-gradient-to-r from-brand-50 via-white to-blue-50/50 rounded-xl border border-brand-100/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Delivery Location Picker
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-brand-600" /> Sadar Rangpur Area
                </span>
              </div>
              <p className="text-xs text-gray-700 font-semibold mt-0.5">
                {displayAddress
                  ? `${displayAddress}${displayCity ? `, ${displayCity}` : ""}`
                  : "Select neighborhood or pin point on Google Maps"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={geoLocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-white border border-brand-200 hover:bg-brand-50 rounded-lg shadow-xs transition-colors"
            >
              <Crosshair className={`w-3.5 h-3.5 ${geoLocating ? "animate-spin text-brand-600" : ""}`} />
              {geoLocating ? "Detecting..." : "My Location"}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-xs transition-colors"
            >
              <MapIcon className="w-3.5 h-3.5" />
              {isOpen ? "Close Selector" : "Choose Neighborhood"}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Quick Dropdown Selector for Rangpur Sadar Neighborhoods */}
        <div className="pt-2 border-t border-brand-100/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label htmlFor="rangpur-neighborhood-select" className="text-xs font-bold text-brand-900 flex items-center gap-1.5 flex-shrink-0">
            <Store className="w-3.5 h-3.5 text-brand-600" />
            Rangpur Sadar Area:
          </label>
          <div className="relative flex-1">
            <select
              id="rangpur-neighborhood-select"
              value={selectedRangpurHood}
              onChange={(e) => {
                const found = RANGPUR_SADAR_NEIGHBORHOODS.find((h) => h.id === e.target.value);
                if (found) handleSelectRangpurHood(found);
              }}
              className="w-full bg-white border border-brand-200 text-gray-800 text-xs font-semibold rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-xs"
            >
              <option value="" disabled>-- Select Neighborhood in Sadar, Rangpur --</option>
              {RANGPUR_SADAR_NEIGHBORHOODS.map((hood) => (
                <option key={hood.id} value={hood.id}>
                  {hood.name} ({hood.landmark}) {hood.isHub ? "★ Main Hub" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab("rangpur");
              setIsOpen(true);
            }}
            className="text-[11px] font-bold text-brand-600 hover:text-brand-800 underline whitespace-nowrap px-1"
          >
            View All Neighborhoods
          </button>
        </div>
      </div>

      {/* Expandable Location Selector Panel */}
      {isOpen && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-md space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("rangpur")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === "rangpur"
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                Rangpur Sadar Areas
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("preset")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === "preset"
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Bangladesh Major Cities
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === "map"
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Google Maps Pin
              </button>
            </div>

            <span className="text-[11px] text-gray-400 font-medium">
              Click to select delivery spot
            </span>
          </div>

          {/* Tab 1: Rangpur Sadar Neighborhood Grid */}
          {activeTab === "rangpur" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-brand-600" />
                  Select specific neighborhood in Sadar, Rangpur:
                </p>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ⚡ 24h Express Local Delivery
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {RANGPUR_SADAR_NEIGHBORHOODS.map((hood) => {
                  const isSelected = selectedRangpurHood === hood.id;
                  return (
                    <button
                      key={hood.id}
                      type="button"
                      onClick={() => handleSelectRangpurHood(hood)}
                      className={`flex items-start justify-between p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? "border-brand-600 bg-brand-50/90 text-brand-950 font-bold shadow-xs ring-2 ring-brand-500/20"
                          : "border-gray-200 hover:border-brand-300 hover:bg-gray-50/80 text-gray-800"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold">{hood.name}</span>
                          {hood.isHub && (
                            <span className="text-[9px] bg-brand-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                              Main Hub
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight">{hood.landmark}</p>
                        <p className="text-[10px] text-gray-400 font-mono">Postal Code: {hood.postal}</p>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Bangladesh Major Cities */}
          {activeTab === "preset" && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-gray-600">
                Countrywide City & Regional Hubs:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {BANGLADESH_LOCATIONS.map((loc) => {
                  const isSelected =
                    displayCity?.toLowerCase() === loc.name.split(",")[0].toLowerCase();
                  return (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => handleSelectPreset(loc)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? "border-brand-600 bg-brand-50/80 text-brand-900 font-bold shadow-xs"
                          : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 text-gray-700 font-medium"
                      }`}
                    >
                      <div>
                        <div className="text-xs">{loc.name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">
                          {loc.division} • {loc.postal}
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Interactive Map */}
          {activeTab === "map" && (
            <div>
              {hasValidKey ? (
                <APIProvider apiKey={apiKey} version="weekly">
                  <MapLocationPickerContent
                    position={selectedPos}
                    setPosition={setSelectedPos}
                    onAddressResolved={(resolved) => {
                      setTempData(resolved);
                      onSelectLocation(resolved);
                    }}
                  />
                </APIProvider>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                  <div className="flex items-start gap-2.5 text-amber-800">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold">Google Maps API Key Setup Instructions</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        To enable full interactive Google Maps address search and street pin-pointing, add your Google Maps API Key in AI Studio Secrets:
                      </p>
                      <ol className="list-decimal list-inside text-[11px] text-amber-800 mt-2 space-y-1">
                        <li>
                          Open <strong>Settings</strong> (⚙️ gear icon in top right) → <strong>Secrets</strong>
                        </li>
                        <li>
                          Add secret name: <code className="bg-amber-100 px-1 py-0.5 rounded">GOOGLE_MAPS_PLATFORM_KEY</code>
                        </li>
                        <li>Paste your API key and press Enter.</li>
                      </ol>
                    </div>
                  </div>

                  <div className="border-t border-amber-200/60 pt-3">
                    <p className="text-xs font-semibold text-amber-900 mb-2">
                      Alternative: Choose Rangpur Sadar Neighborhood
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {RANGPUR_SADAR_NEIGHBORHOODS.slice(0, 6).map((hood) => (
                        <button
                          key={hood.id}
                          type="button"
                          onClick={() => handleSelectRangpurHood(hood)}
                          className="px-2.5 py-1.5 bg-white border border-amber-200 hover:bg-amber-100/50 rounded-lg text-xs font-medium text-amber-900 text-left truncate"
                        >
                          📍 {hood.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
