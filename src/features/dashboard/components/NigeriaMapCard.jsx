import NigeriaMap from '@/components/NigeriaMap';
import { useTheme } from '@/context/ThemeContext';

export function NigeriaMapCard({
  regionData,
  onRegionSelect,
  onStateSelect,
  selectedRegion,
  selectedState,
}) {
  const { isDark } = useTheme();

  return (
    <NigeriaMap
      regionData={regionData}
      onRegionSelect={onRegionSelect}
      onStateSelect={onStateSelect}
      selectedRegion={selectedRegion}
      selectedState={selectedState}
      isDark={isDark}
    />
  );
}
