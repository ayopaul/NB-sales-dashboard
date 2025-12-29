// Nigerian Breweries brands
export const brands = [
  { id: 'star', name: 'Star Lager', color: '#e31937' },
  { id: 'gulder', name: 'Gulder', color: '#c4a747' },
  { id: 'heineken', name: 'Heineken', color: '#00a650' },
  { id: 'legend', name: 'Legend Extra Stout', color: '#1a1a1a' },
  { id: 'life', name: 'Life Continental', color: '#0066b3' },
  { id: 'goldberg', name: 'Goldberg', color: '#d4a574' },
  { id: 'maltina', name: 'Maltina', color: '#8b4513' },
  { id: 'amstel', name: 'Amstel Malta', color: '#c8102e' },
  { id: 'fayrouz', name: 'Fayrouz', color: '#ff6b35' },
  { id: 'climax', name: 'Climax Energy', color: '#ffd700' },
];

// Zones and their regions based on the image
export const zones = {
  WEST: {
    name: 'West',
    color: '#2d5a27',
    regions: ['Ibadan', 'Benin', 'Lagos North', 'Lagos Central', 'Lagos South']
  },
  EAST: {
    name: 'East',
    color: '#8b4513',
    regions: ['Aba', 'Enugu', 'Onitsha', 'Port Harcourt', 'Uyo']
  },
  NORTH: {
    name: 'North',
    color: '#654321',
    regions: ['Abuja', 'Jos', 'Kaduna', 'Makurdi', 'Yola']
  }
};

// Region to states mapping (based on the image)
export const regionStates = {
  'Ibadan': ['Oyo', 'Osun', 'Ekiti'],
  'Benin': ['Edo', 'Ondo', 'Kogi'],
  'Lagos North': ['Ogun', 'Lagos'],
  'Lagos Central': ['Lagos'],
  'Lagos South': ['Lagos'],
  'Aba': ['Abia', 'Imo'],
  'Enugu': ['Enugu', 'Ebonyi'],
  'Onitsha': ['Anambra', 'Delta'],
  'Port Harcourt': ['Rivers', 'Bayelsa'],
  'Uyo': ['Akwa Ibom', 'Cross River'],
  'Abuja': ['FCT', 'Niger', 'Nasarawa', 'Kwara'],
  'Jos': ['Plateau', 'Taraba', 'Benue'],
  'Kaduna': ['Kaduna', 'Katsina', 'Zamfara', 'Sokoto', 'Kebbi'],
  'Makurdi': ['Benue', 'Kogi'],
  'Yola': ['Adamawa', 'Borno', 'Yobe', 'Gombe', 'Bauchi', 'Jigawa']
};

// Region colors from the map
export const regionColors = {
  'Ibadan': '#3cb371',
  'Benin': '#4169e1',
  'Lagos North': '#32cd32',
  'Lagos Central': '#2e8b57',
  'Lagos South': '#00ced1',
  'Aba': '#da70d6',
  'Enugu': '#90ee90',
  'Onitsha': '#ffa500',
  'Port Harcourt': '#8b0000',
  'Uyo': '#006400',
  'Abuja': '#d2b48c',
  'Jos': '#228b22',
  'Kaduna': '#d2691e',
  'Makurdi': '#2f4f4f',
  'Yola': '#8b4513'
};

// Generate random sales data for demo
const generateMonthlySales = (baseValue, trend = 'stable') => {
  const months = [];
  let currentValue = baseValue;

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    // Add some variation
    const variation = (Math.random() - 0.5) * baseValue * 0.3;

    // Apply trend
    if (trend === 'increasing') {
      currentValue = baseValue + (11 - i) * (baseValue * 0.05) + variation;
    } else if (trend === 'decreasing') {
      currentValue = baseValue - (11 - i) * (baseValue * 0.04) + variation;
    } else {
      currentValue = baseValue + variation;
    }

    months.push({
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      value: Math.max(0, Math.round(currentValue))
    });
  }

  return months;
};

// Generate brand sales breakdown
const generateBrandBreakdown = (totalSales) => {
  const breakdown = {};
  let remaining = totalSales;

  const brandWeights = {
    'star': 0.25,
    'gulder': 0.15,
    'heineken': 0.18,
    'legend': 0.08,
    'life': 0.06,
    'goldberg': 0.10,
    'maltina': 0.08,
    'amstel': 0.05,
    'fayrouz': 0.03,
    'climax': 0.02
  };

  brands.forEach((brand, index) => {
    const weight = brandWeights[brand.id] || 0.05;
    const variation = 1 + (Math.random() - 0.5) * 0.3;
    const value = index === brands.length - 1
      ? remaining
      : Math.round(totalSales * weight * variation);

    breakdown[brand.id] = Math.max(0, value);
    remaining -= breakdown[brand.id];
  });

  return breakdown;
};

// Generate region sales data
export const generateRegionSalesData = () => {
  const trends = ['increasing', 'decreasing', 'stable'];
  const regionData = {};

  Object.keys(regionStates).forEach(region => {
    const baseValue = 50000 + Math.random() * 150000;
    const trend = trends[Math.floor(Math.random() * 3)];
    const monthlySales = generateMonthlySales(baseValue, trend);
    const currentSales = monthlySales[monthlySales.length - 1].value;
    const previousSales = monthlySales[monthlySales.length - 2].value;
    const percentChange = ((currentSales - previousSales) / previousSales * 100).toFixed(1);

    regionData[region] = {
      name: region,
      zone: Object.entries(zones).find(([_, z]) => z.regions.includes(region))?.[0] || 'WEST',
      states: regionStates[region],
      color: regionColors[region],
      currentSales,
      previousSales,
      percentChange: parseFloat(percentChange),
      trend: percentChange > 2 ? 'up' : percentChange < -2 ? 'down' : 'stable',
      monthlySales,
      brandBreakdown: generateBrandBreakdown(currentSales),
      targets: {
        monthly: Math.round(currentSales * 1.1),
        quarterly: Math.round(currentSales * 3.3),
        yearly: Math.round(currentSales * 12 * 1.05)
      }
    };
  });

  return regionData;
};

// Generate state sales data
export const generateStateSalesData = () => {
  const stateData = {};
  const allStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const trends = ['increasing', 'decreasing', 'stable'];

  allStates.forEach(state => {
    const baseValue = 10000 + Math.random() * 50000;
    const trend = trends[Math.floor(Math.random() * 3)];
    const monthlySales = generateMonthlySales(baseValue, trend);
    const currentSales = monthlySales[monthlySales.length - 1].value;
    const previousSales = monthlySales[monthlySales.length - 2].value;
    const percentChange = ((currentSales - previousSales) / previousSales * 100).toFixed(1);

    // Find which region this state belongs to
    const region = Object.entries(regionStates).find(([_, states]) =>
      states.includes(state)
    )?.[0] || 'Abuja';

    stateData[state] = {
      name: state,
      region,
      currentSales,
      previousSales,
      percentChange: parseFloat(percentChange),
      trend: percentChange > 2 ? 'up' : percentChange < -2 ? 'down' : 'stable',
      monthlySales,
      brandBreakdown: generateBrandBreakdown(currentSales)
    };
  });

  return stateData;
};

// Activity log generator
export const generateActivityLog = () => {
  const activities = [
    { type: 'sale', message: 'Large order processed in {region}', icon: 'shopping-cart' },
    { type: 'target', message: '{region} achieved monthly target', icon: 'target' },
    { type: 'alert', message: 'Stock running low in {region}', icon: 'alert-triangle' },
    { type: 'growth', message: '{region} sales increased by {percent}%', icon: 'trending-up' },
    { type: 'decline', message: '{region} sales decreased by {percent}%', icon: 'trending-down' },
  ];

  const regions = Object.keys(regionStates);
  const log = [];

  for (let i = 0; i < 10; i++) {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const percent = Math.floor(Math.random() * 20) + 5;
    const hoursAgo = Math.floor(Math.random() * 48);

    log.push({
      id: i,
      type: activity.type,
      message: activity.message.replace('{region}', region).replace('{percent}', percent),
      icon: activity.icon,
      time: hoursAgo === 0 ? 'Just now' : hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`,
      timestamp: new Date(Date.now() - hoursAgo * 3600000)
    });
  }

  return log.sort((a, b) => b.timestamp - a.timestamp);
};

// Calculate zone totals
export const calculateZoneTotals = (regionData) => {
  const zoneTotals = {};

  Object.entries(zones).forEach(([zoneKey, zone]) => {
    let totalSales = 0;
    let totalPrevious = 0;

    zone.regions.forEach(region => {
      if (regionData[region]) {
        totalSales += regionData[region].currentSales;
        totalPrevious += regionData[region].previousSales;
      }
    });

    const percentChange = ((totalSales - totalPrevious) / totalPrevious * 100).toFixed(1);

    zoneTotals[zoneKey] = {
      name: zone.name,
      color: zone.color,
      regions: zone.regions,
      totalSales,
      totalPrevious,
      percentChange: parseFloat(percentChange),
      trend: percentChange > 2 ? 'up' : percentChange < -2 ? 'down' : 'stable'
    };
  });

  return zoneTotals;
};

// Format currency (Nigerian Naira)
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format number with commas
export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-NG').format(value);
};
