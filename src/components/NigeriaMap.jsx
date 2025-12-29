import { useState, useMemo } from 'react';
import { nigeriaStatePaths, mapViewBox } from '../data/nigeriaMapData';
import { zones, regionStates, formatCurrency } from '../data/salesData';

// State to region mapping
const stateToRegion = {};
Object.entries(regionStates).forEach(([region, states]) => {
  states.forEach(state => {
    stateToRegion[state] = region;
  });
});

// State to zone mapping
const stateToZone = {};
Object.entries(zones).forEach(([zoneKey, zone]) => {
  zone.regions.forEach(region => {
    if (regionStates[region]) {
      regionStates[region].forEach(state => {
        stateToZone[state] = zoneKey;
      });
    }
  });
});

// Performance color scale (from poor to excellent)
const getPerformanceColor = (percentChange, isDark) => {
  if (percentChange === undefined || percentChange === null) {
    return isDark ? '#374151' : '#d1d5db'; // gray for no data
  }

  // Color scale based on percent change
  if (percentChange >= 10) {
    return isDark ? '#22c55e' : '#16a34a'; // Strong green - excellent
  } else if (percentChange >= 5) {
    return isDark ? '#4ade80' : '#22c55e'; // Light green - good
  } else if (percentChange >= 0) {
    return isDark ? '#a3e635' : '#84cc16'; // Lime - moderate positive
  } else if (percentChange >= -5) {
    return isDark ? '#facc15' : '#eab308'; // Yellow - slight decline
  } else if (percentChange >= -10) {
    return isDark ? '#fb923c' : '#f97316'; // Orange - moderate decline
  } else {
    return isDark ? '#ef4444' : '#dc2626'; // Red - poor performance
  }
};

// Get opacity based on sales volume (higher sales = more opaque)
const getSalesOpacity = (sales, maxSales) => {
  if (!sales || !maxSales) return 0.4;
  const ratio = sales / maxSales;
  return 0.4 + (ratio * 0.6); // Range from 0.4 to 1.0
};

const NigeriaMap = ({
  regionData,
  onRegionSelect,
  onStateSelect,
  selectedRegion,
  selectedState,
  isDark,
  selectionMode = 'region' // 'region' or 'state'
}) => {
  const [hoveredState, setHoveredState] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [localSelectionMode, setLocalSelectionMode] = useState(selectionMode);

  // Calculate max sales for opacity scaling
  const maxSales = useMemo(() => {
    if (!regionData) return 0;
    return Math.max(...Object.values(regionData).map(r => r.currentSales || 0));
  }, [regionData]);

  const getStateColor = (state) => {
    const region = stateToRegion[state];
    if (!region) return isDark ? '#374151' : '#d1d5db';

    const salesData = regionData?.[region];
    if (!salesData) return isDark ? '#374151' : '#d1d5db';

    // Get performance-based color
    const baseColor = getPerformanceColor(salesData.percentChange, isDark);
    const opacity = getSalesOpacity(salesData.currentSales, maxSales);

    // Highlight selected state
    if (selectedState === state) {
      return isDark ? '#60a5fa' : '#3b82f6'; // Blue for selected state
    }

    // Highlight all states in selected region
    if (selectedRegion === region) {
      return adjustBrightness(baseColor, isDark ? 25 : 35);
    }

    // Highlight hovered region (all states in it)
    if (localSelectionMode === 'region' && hoveredRegion === region) {
      return adjustBrightness(baseColor, isDark ? 20 : 30);
    }

    // Highlight hovered state
    if (hoveredState === state) {
      return adjustBrightness(baseColor, isDark ? 30 : 40);
    }

    return baseColor;
  };

  const adjustBrightness = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  };

  const handleStateClick = (state) => {
    const region = stateToRegion[state];

    if (localSelectionMode === 'region') {
      // Select the whole region
      if (onRegionSelect && region) onRegionSelect(region);
      if (onStateSelect) onStateSelect(null); // Clear state selection
    } else {
      // Select individual state
      if (onStateSelect) onStateSelect(state);
      if (onRegionSelect && region) onRegionSelect(region);
    }
  };

  const handleStateHover = (state) => {
    setHoveredState(state);
    if (localSelectionMode === 'region') {
      setHoveredRegion(stateToRegion[state]);
    }
  };

  const handleStateLeave = () => {
    setHoveredState(null);
    setHoveredRegion(null);
  };

  const getTooltipContent = (state) => {
    const region = stateToRegion[state];
    const zone = stateToZone[state];
    const salesData = regionData?.[region];

    return {
      state,
      region: region || 'N/A',
      zone: zones[zone]?.name || 'N/A',
      sales: salesData?.currentSales || 0,
      previousSales: salesData?.previousSales || 0,
      percentChange: salesData?.percentChange || 0,
      trend: salesData?.trend || 'stable'
    };
  };

  // Performance legend colors
  const performanceLegend = [
    { label: 'Excellent (>10%)', color: isDark ? '#22c55e' : '#16a34a' },
    { label: 'Good (5-10%)', color: isDark ? '#4ade80' : '#22c55e' },
    { label: 'Moderate (0-5%)', color: isDark ? '#a3e635' : '#84cc16' },
    { label: 'Slight Decline (-5-0%)', color: isDark ? '#facc15' : '#eab308' },
    { label: 'Decline (-10 to -5%)', color: isDark ? '#fb923c' : '#f97316' },
    { label: 'Poor (<-10%)', color: isDark ? '#ef4444' : '#dc2626' },
  ];

  return (
    <div className="relative w-full">
      {/* Selection Mode Toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Select by:</span>
          <div className={`inline-flex rounded-lg p-0.5 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <button
              onClick={() => setLocalSelectionMode('region')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                localSelectionMode === 'region'
                  ? isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow-sm'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Region
            </button>
            <button
              onClick={() => setLocalSelectionMode('state')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                localSelectionMode === 'state'
                  ? isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow-sm'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              State
            </button>
          </div>
        </div>
        {selectedRegion && (
          <button
            onClick={() => {
              if (onRegionSelect) onRegionSelect(null);
              if (onStateSelect) onStateSelect(null);
            }}
            className={`text-xs px-2 py-1 rounded ${
              isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Clear Selection
          </button>
        )}
      </div>

      <svg
        viewBox={mapViewBox}
        className="w-full h-auto"
        style={{ maxHeight: '350px' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect
          x="0"
          y="0"
          width="744.24182"
          height="599.92847"
          fill={isDark ? 'hsl(222.2 84% 4.9%)' : 'hsl(210 40% 98%)'}
          rx="12"
        />

        {/* Map paths */}
        {Object.entries(nigeriaStatePaths).map(([stateName, { d, id }]) => {
          const region = stateToRegion[stateName];
          const isInSelectedRegion = selectedRegion === region;
          const isInHoveredRegion = localSelectionMode === 'region' && hoveredRegion === region;

          return (
            <path
              key={id}
              d={d}
              fill={getStateColor(stateName)}
              stroke={isDark ? 'hsl(222.2 84% 4.9%)' : '#ffffff'}
              strokeWidth={isInSelectedRegion || isInHoveredRegion ? '1.5' : '0.75'}
              strokeOpacity={isInSelectedRegion ? '1' : '0.6'}
              className="cursor-pointer transition-all duration-200"
              onClick={() => handleStateClick(stateName)}
              onMouseEnter={() => handleStateHover(stateName)}
              onMouseLeave={handleStateLeave}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredState && (
        <div
          className={`absolute pointer-events-none z-50 px-3 py-2.5 rounded-lg shadow-lg border ${
            isDark ? 'bg-popover text-popover-foreground border-border' : 'bg-white text-gray-900 border-gray-200'
          }`}
          style={{
            left: '50%',
            bottom: '12px',
            transform: 'translateX(-50%)',
          }}
        >
          {(() => {
            const info = getTooltipContent(hoveredState);
            return (
              <div className="text-xs space-y-1">
                {localSelectionMode === 'region' ? (
                  <>
                    <div className="font-semibold text-sm">{info.zone} Zone</div>
                    <div className="text-muted-foreground text-[10px]">{info.region} • {info.state}</div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-sm">{info.state}</div>
                    <div className="text-muted-foreground text-[10px]">{info.region} • {info.zone} Zone</div>
                  </>
                )}
                {info.sales > 0 && (
                  <>
                    <div className="pt-1 border-t border-border">
                      <span className="text-muted-foreground">Sales: </span>
                      <span className="font-medium">{formatCurrency(info.sales)}</span>
                    </div>
                    <div className={`font-medium ${
                      info.percentChange > 0 ? 'text-green-500' : info.percentChange < 0 ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {info.percentChange > 0 ? '+' : ''}{info.percentChange}% vs last month
                    </div>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Performance Legend */}
      <div className={`mt-3 pt-3 border-t border-border`}>
        <div className={`text-xs font-medium mb-2 text-muted-foreground`}>
          Performance (% Change)
        </div>
        <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
          {performanceLegend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className={`text-[10px] truncate text-muted-foreground`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NigeriaMap;
