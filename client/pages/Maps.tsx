import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { getReports, searchLocations, markReportAsResolved } from "@/lib/database";
import { Report } from "@/lib/database.types";
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// Static data for visual demonstration
const staticReports = [
  {
    id: "static-1",
    title: "Severe Pollution",
    location_name: "Mithi River",
    created_at: "2024-03-15T10:00:00Z",
    description: "High pollution levels reported near the industrial area.",
    photos: ["https://images.unsplash.com/photo-1611222625683-3fd7b4b67765?w=300&h=200&fit=crop"],
    severity: "severe" as const,
    type: "pollution" as const,
    latitude: 19.1176,
    longitude: 72.8863,
    status: "approved" as const,
    user_id: "demo",
    updated_at: "2024-03-15T10:00:00Z",
    reviewed_at: null,
    reviewed_by: null
  },
  {
    id: "static-2",
    title: "Moderate Pollution",
    location_name: "Poisar River",
    created_at: "2024-03-10T14:30:00Z",
    description: "Moderate pollution due to plastic waste accumulation.",
    photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"],
    severity: "moderate" as const,
    type: "pollution" as const,
    latitude: 19.1833,
    longitude: 72.833,
    status: "approved" as const,
    user_id: "demo",
    updated_at: "2024-03-10T14:30:00Z",
    reviewed_at: null,
    reviewed_by: null
  },
  {
    id: "static-3",
    title: "Community Cleanup Drive",
    location_name: "Dahisar River",
    created_at: "2024-03-05T09:00:00Z",
    description: "Successful community cleanup drive completed.",
    photos: ["https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop"],
    severity: "moderate" as const,
    type: "cleanup" as const,
    latitude: 19.254,
    longitude: 72.852,
    status: "approved" as const,
    user_id: "demo",
    updated_at: "2024-03-05T09:00:00Z",
    reviewed_at: null,
    reviewed_by: null
  },
  {
    id: "static-4",
    title: "Scheduled Cleanup",
    location_name: "Powai Lake",
    created_at: "2024-03-22T08:00:00Z",
    description: "Upcoming cleanup drive scheduled for next week.",
    photos: [],
    severity: "moderate" as const,
    type: "cleanup" as const,
    latitude: 19.1274,
    longitude: 72.9045,
    status: "approved" as const,
    user_id: "demo",
    updated_at: "2024-03-22T08:00:00Z",
    reviewed_at: null,
    reviewed_by: null
  }
];

// Map style configuration - using reliable OpenStreetMap
const MAP_STYLE = {
  "version": 8,
  "sources": {
    "osm": {
      "type": "raster",
      "tiles": [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ],
      "tileSize": 256,
      "attribution": "&copy; OpenStreetMap Contributors",
      "maxzoom": 19
    }
  },
  "layers": [
    {
      "id": "osm",
      "type": "raster",
      "source": "osm"
    }
  ]
};

export default function Maps() {
  const [activeTab, setActiveTab] = useState("pollution");
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    name: string;
    fullName: string;
    lat: number;
    lon: number;
  }>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingReport, setResolvingReport] = useState<string | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 72.88,
    latitude: 19.13,
    zoom: 12
  });

  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef(null);

  // Cleanup map on unmount to prevent AbortErrors
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        try {
          const map = mapRef.current.getMap();
          if (map && typeof map.remove === 'function') {
            map.remove();
          }
        } catch (error) {
          // Ignore cleanup errors
          console.debug('Map cleanup:', error);
        }
      }
    };
  }, []);

  // Load reports on component mount and tab change
  useEffect(() => {
    loadReports();
  }, [activeTab]);

  const loadReports = async () => {
    setLoading(true);

    try {
      console.log('Loading ALL reports for tab:', activeTab);

      // Fetch all reports from database (not user-specific)
      const dynamicReports = await getReports(activeTab as 'pollution' | 'cleanup');
      console.log('All user reports loaded successfully:', dynamicReports.length);

      // Also include static demo data for better UX
      const staticFiltered = staticReports.filter(r => r.type === activeTab);

      // Combine all reports (both static demo and real user reports)
      const allReports = [...staticFiltered, ...dynamicReports];
      console.log('Total reports shown:', allReports.length, '(demo:', staticFiltered.length, ', user reports:', dynamicReports.length, ')');

      setReports(allReports);
    } catch (error) {
      console.warn('Could not load reports from database, showing demo data only:');
      if (error instanceof Error) {
        console.warn('Error message:', error.message);
        console.warn('Error stack:', error.stack);
      } else {
        console.warn('Error details:', {
          error: error,
          type: typeof error,
          string: String(error)
        });
      }

      // Fallback to static demo data only
      const staticFiltered = staticReports.filter(r => r.type === activeTab);
      setReports(staticFiltered);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const results = await searchLocations(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const handleSearchResultClick = (result: { name: string; lat: number; lon: number }) => {
    setViewState({
      longitude: result.lon,
      latitude: result.lat,
      zoom: 15
    });
    setSearchQuery(result.name);
    setShowSearchResults(false);
    searchInputRef.current?.blur();
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const getMarkerColor = (report: Report) => {
    if (report.status === 'resolved') {
      return 'text-gray-400';
    } else if (report.type === 'cleanup') {
      return 'text-green-600';
    } else {
      switch (report.severity) {
        case 'severe': return 'text-red-600';
        case 'moderate': return 'text-orange-500';
        case 'low': return 'text-yellow-500';
        default: return 'text-red-600';
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleResolveReport = async (reportId: string) => {
    if (!user) return;

    setResolvingReport(reportId);
    try {
      const success = await markReportAsResolved(reportId, user.id);
      if (success) {
        // Update the local state to reflect the resolved status
        setReports(prev => prev.map(report =>
          report.id === reportId
            ? { ...report, status: 'resolved' as const }
            : report
        ));
        setActiveReport(prev =>
          prev?.id === reportId
            ? { ...prev, status: 'resolved' as const }
            : prev
        );
      }
    } catch (error) {
      console.error('Error resolving report:', error);
    } finally {
      setResolvingReport(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      <main className="w-full flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white border-b lg:border-r lg:border-b-0 border-gray-200 h-auto lg:h-screen flex flex-col">
          {/* Tabs */}
          <div className="border-b border-[#DBE3E5] px-4">
            <div className="flex">
              <button
                onClick={() => setActiveTab("pollution")}
                className={`px-2 md:px-4 py-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
                  activeTab === "pollution"
                    ? "text-[#121717] border-[#12B5ED]"
                    : "text-[#61808A] border-transparent hover:text-[#121717]"
                }`}
              >
                Pollution Reports
              </button>
              <button
                onClick={() => setActiveTab("cleanup")}
                className={`px-2 md:px-8 py-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
                  activeTab === "cleanup"
                    ? "text-[#121717] border-[#12B5ED]"
                    : "text-[#61808A] border-transparent hover:text-[#121717]"
                }`}
              >
                Cleanup Drives
              </button>
            </div>

            {/* Legend */}
            {activeTab === "pollution" && (
              <div className="py-2 text-xs text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Severe</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Resolved</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Report List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#12B5ED] mx-auto"></div>
                <p className="text-[#61808A] mt-2">Loading reports...</p>
              </div>
            ) : (
              <div className="space-y-0">
                {reports.length === 0 ? (
                  <div className="p-6 text-center text-[#61808A]">
                    <p>No {activeTab} reports available</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-3 border-b border-gray-100 transition-colors cursor-pointer ${
                        report.status === 'resolved'
                          ? 'bg-gray-50 opacity-75 hover:bg-gray-100'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setViewState({
                          longitude: report.longitude,
                          latitude: report.latitude,
                          zoom: 16
                        });
                        setActiveReport(report);
                      }}
                    >
                      <div className="flex gap-4">
                        {report.photos && report.photos.length > 0 ? (
                          <img
                            src={report.photos[0]}
                            alt={report.title}
                            className="w-20 md:w-24 h-12 md:h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-20 md:w-24 h-12 md:h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm md:text-base mb-1 line-clamp-1 ${
                            report.status === 'resolved'
                              ? 'text-gray-500 line-through'
                              : 'text-[#121717]'
                          }`}>
                            {report.title}
                          </h3>
                          <p className="text-xs md:text-sm text-[#61808A] mb-1">{report.location_name}</p>
                          <p className="text-xs text-[#61808A] mb-1">{formatDate(report.created_at)}</p>
                          <p className="text-xs md:text-sm text-[#61808A] leading-relaxed line-clamp-2">
                            {report.description}
                          </p>
                        </div>

                        <div className="flex flex-col justify-start pt-1">
                          <div className="w-6 h-6 flex items-center justify-center">
                            <div className={`w-3 h-3 rounded-full ${
                              report.status === 'resolved'
                                ? 'bg-gray-400'
                                : report.type === 'cleanup'
                                  ? 'bg-green-500'
                                  : report.severity === 'severe' ? 'bg-red-500'
                                  : report.severity === 'moderate' ? 'bg-orange-500'
                                  : 'bg-yellow-500'
                            }`}></div>
                          </div>
                          {report.status === 'resolved' && (
                            <div className="text-xs text-gray-500 mt-1">✓ Resolved</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative" style={{ minHeight: "90vh" }}>
          <Map
            ref={mapRef}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            onError={(error) => {
              // Suppress common AbortErrors and network errors
              if (error?.error?.name === 'AbortError' ||
                  error?.message?.includes('AbortError') ||
                  error?.message?.includes('signal is aborted')) {
                return; // Silently ignore
              }
              console.warn('Map error:', error);
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle={MAP_STYLE}
            reuseMaps={true}
            preserveDrawingBuffer={true}
            optimizeForTerrain={false}
            antialias={false}
            failIfMajorPerformanceCaveat={false}
          >
            {reports.map((report) => (
              <Marker key={report.id} longitude={report.longitude} latitude={report.latitude} anchor="bottom">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveReport(report);
                  }}
                  className="p-0 bg-transparent border-0 cursor-pointer hover:scale-110 transition-transform"
                >
                  <svg className={`w-6 h-6 ${getMarkerColor(report)}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8 2 5 5.03 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.97-3-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                </button>
              </Marker>
            ))}

            {activeReport && (
              <Popup
                anchor="top"
                longitude={activeReport.longitude}
                latitude={activeReport.latitude}
                onClose={() => setActiveReport(null)}
                closeOnClick={false}
                className="min-w-0"
              >
                <div className="max-w-xs p-2">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm flex-1">{activeReport.title}</h4>
                    {activeReport.status === 'resolved' && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2">
                        ✓ Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#61808A] mb-1">{activeReport.location_name}</p>
                  <p className="text-xs text-gray-500 mb-2">{formatDate(activeReport.created_at)}</p>
                  <p className="text-sm leading-relaxed mb-2">{activeReport.description}</p>
                  {activeReport.photos && activeReport.photos.length > 0 && (
                    <img
                      src={activeReport.photos[0]}
                      alt={activeReport.title}
                      className="mt-2 w-full h-24 object-cover rounded mb-2"
                    />
                  )}

                  {/* Resolve Button - Only show for pollution reports that aren't resolved yet */}
                  {user && activeReport.type === 'pollution' && activeReport.status !== 'resolved' && (
                    <Button
                      onClick={() => handleResolveReport(activeReport.id)}
                      disabled={resolvingReport === activeReport.id}
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs mt-2"
                    >
                      {resolvingReport === activeReport.id ? 'Resolving...' : '✓ Mark as Resolved'}
                    </Button>
                  )}
                </div>
              </Popup>
            )}
          </Map>

          {/* Search Bar */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 z-20">
            <div className="relative">
              <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(searchResults.length > 0)}
                  placeholder="Search Mumbai locations"
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={handleSearchClear}
                    className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-30">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900 text-sm">{result.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate">{result.fullName}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-32 right-4 space-y-2 z-10">
            <div className="flex flex-col">
              <button
                onClick={() => setViewState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 1, 20) }))}
                className="w-10 h-10 bg-white rounded-t-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 1, 1) }))}
                className="w-10 h-10 bg-white rounded-b-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>
            </div>

            <button
              onClick={() => setViewState({ longitude: 72.88, latitude: 19.13, zoom: 12 })}
              className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="Reset to Mumbai"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
              </svg>
            </button>
          </div>

          {/* Report Pollution Button - Only show for authenticated users */}
          {user && (
            <div className="absolute bottom-5 right-5 z-10">
              <Button
                asChild
                className="bg-[#12B5ED] hover:bg-[#0ea5e1] text-white text-base font-semibold px-6 h-12 rounded-full shadow-lg flex items-center gap-3 transition-all hover:scale-105"
              >
                <Link to="/report">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 18 18">
                    <path fillRule="evenodd" d="M18 9C18 9.41421 17.6642 9.75 17.25 9.75H9.75V17.25C9.75 17.6642 9.41421 18 9 18C8.58579 18 8.25 17.6642 8.25 17.25V9.75H0.75C0.335786 9.75 0 9.41421 0 9C0 8.58579 0.335786 8.25 0.75 8.25H8.25V0.75C8.25 0.335786 8.58579 0 9 0C9.41421 0 9.75 0.335786 9.75 0.75V8.25H17.25C17.6642 8.25 18 8.58579 18 9Z" clipRule="evenodd" />
                  </svg>
                  Report Pollution
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-5 py-3">
          <div className="text-center">
            <p className="text-sm text-[#61808A]">
              Data powered by CleanFlow community {user && <span className="font-semibold">• Logged in as {user.email}</span>}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
