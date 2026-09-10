export const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'receive', label: 'Receive stock', icon: 'inbox' },
  { id: 'inventory', label: 'Inventory', icon: 'boxes' },
  { id: 'picking', label: 'Pick items', icon: 'checklist' },
  { id: 'reorder', label: 'Reorder recs', icon: 'trend' },
  { id: 'alerts', label: 'Alerts center', icon: 'bell' },
  { id: 'activity', label: 'Activity log', icon: 'clock' },
  { id: 'reports', label: 'Reports', icon: 'report' },
];

export const users = [
  { name: 'Mark Nathan', initials: 'MN', role: 'Inventory Manager' },
  { name: 'Rica Mae', initials: 'RM', role: 'Warehouse Staff' },
  { name: 'Karl Mark', initials: 'KM', role: 'Picking Staff' },
  { name: 'Belchez', initials: 'BE', role: 'Purchasing Manager' },
  { name: 'Kaye Xierhyl', initials: 'KX', role: 'Administrator' },
];

export const roleAccess = {
  'Inventory Manager': ['dashboard', 'receive', 'inventory', 'picking', 'reorder', 'alerts', 'activity', 'reports'],
  'Warehouse Staff': ['dashboard', 'receive', 'inventory', 'picking', 'alerts', 'reports'],
  'Picking Staff': ['dashboard', 'inventory', 'picking', 'alerts'],
  'Purchasing Manager': ['dashboard', 'inventory', 'reorder', 'alerts', 'reports'],
  Administrator: ['dashboard', 'inventory', 'alerts', 'activity', 'reports'],
};

export const initialProducts = [
  {
    id: 'PAC-12000',
    name: 'BreezePro 12,000 BTU Portable AC',
    category: 'Portable AC',
    onHand: 74,
    available: 68,
    reorderPoint: 90,
    maxStock: 180,
    location: 'A-04-12',
    velocity: 'Seasonal',
    status: 'Reorder now',
    supplier: 'CoolHome Supply',
    lastUpdated: '2 min ago',
  },
  {
    id: 'APF-CARBON',
    name: 'PureAir Carbon Filter',
    category: 'Replacement Filter',
    onHand: 162,
    available: 158,
    reorderPoint: 100,
    maxStock: 260,
    location: 'C-02-06',
    velocity: 'Steady',
    status: 'Expiry watch',
    supplier: 'AirCare Trading',
    lastUpdated: '5 min ago',
  },
  {
    id: 'TH-X200',
    name: 'ThermoLink X200 Smart Thermostat',
    category: 'Smart Thermostat',
    onHand: 12,
    available: 12,
    reorderPoint: 20,
    maxStock: 75,
    location: 'B-01-03',
    velocity: 'Steady',
    status: 'Critical',
    supplier: 'HomeGrid Electronics',
    lastUpdated: '8 min ago',
  },
  {
    id: 'APR-500',
    name: 'PureAir 500 Air Purifier',
    category: 'Air Purifier',
    onHand: 98,
    available: 98,
    reorderPoint: 40,
    maxStock: 110,
    location: 'D-03-02',
    velocity: 'Steady',
    status: 'Healthy',
    supplier: 'AirCare Trading',
    lastUpdated: '12 min ago',
  },
  {
    id: 'PAC-9000',
    name: 'BreezePro 9,000 BTU Portable AC',
    category: 'Portable AC',
    onHand: 142,
    available: 142,
    reorderPoint: 75,
    maxStock: 165,
    location: 'A-03-08',
    velocity: 'Seasonal',
    status: 'Healthy',
    supplier: 'CoolHome Supply',
    lastUpdated: '15 min ago',
  },
];

export const initialLots = [
  { id: 'F-0417', productId: 'APF-CARBON', received: '2026-01-08', expires: '2026-09-16', quantity: 36, location: 'C-02-06', state: 'Pick first' },
  { id: 'F-0522', productId: 'APF-CARBON', received: '2026-02-12', expires: '2026-10-20', quantity: 54, location: 'C-02-07', state: 'Queued' },
  { id: 'F-0614', productId: 'APF-CARBON', received: '2026-03-16', expires: '2026-11-24', quantity: 72, location: 'C-02-08', state: 'Available' },
  { id: 'AC-8931', productId: 'PAC-12000', received: '2026-04-28', expires: null, quantity: 74, location: 'A-04-12', state: 'Available' },
  { id: 'TH-2160', productId: 'TH-X200', received: '2026-05-11', expires: null, quantity: 12, location: 'B-01-03', state: 'Available' },
];

export const initialAlerts = [
  {
    id: 1,
    type: 'critical',
    productId: 'TH-X200',
    title: 'ThermoLink X200 is below its reorder point',
    detail: '12 available vs. reorder point of 20. The next supplier delivery takes 7 days.',
    time: '2 min ago',
    action: 'Create PO',
    actionTarget: 'reorder',
    read: false,
  },
  {
    id: 2,
    type: 'expiry',
    productId: 'APF-CARBON',
    title: 'Filter lot F-0417 expires in 14 days',
    detail: '36 PureAir Carbon Filters at C-02-06. FEFO priority has been raised.',
    time: '18 min ago',
    action: 'Flag for pick',
    actionTarget: 'picking',
    read: false,
  },
  {
    id: 3,
    type: 'seasonal',
    productId: 'PAC-12000',
    title: 'Portable AC reorder window has opened',
    detail: 'Peak season begins in 6 weeks. Suggested order is forecast-based and capped.',
    time: '1 hr ago',
    action: 'Review forecast',
    actionTarget: 'reorder',
    read: false,
  },
  {
    id: 4,
    type: 'mismatch',
    productId: 'TH-X200',
    title: 'Stock count review needed for ThermoLink X200',
    detail: 'A cycle count is required after a reported shelf mismatch.',
    time: '3 hrs ago',
    action: 'View audit trail',
    actionTarget: 'activity',
    read: false,
  },
  {
    id: 5,
    type: 'overstock',
    productId: 'APR-500',
    title: 'PureAir 500 Air Purifier is nearing max storage capacity',
    detail: '98 available against a 110-unit cap at D-03-02. Hold off on the next PO until space frees up.',
    time: '4 hrs ago',
    action: 'Review inventory',
    actionTarget: 'inventory',
    read: false,
  },
];

export const initialActivity = [
  { id: 1, event: 'Stock discrepancy reported', reference: 'TH-X200', person: 'Karl Mark', role: 'Picking Staff', time: 'Today, 9:42 AM', kind: 'warning' },
  { id: 2, event: 'Shipment received', reference: 'F-0614 - 72 units', person: 'Rica Mae', role: 'Warehouse Staff', time: 'Today, 9:14 AM', kind: 'receive' },
  { id: 3, event: 'FEFO pick completed', reference: 'F-0417 - 8 units', person: 'Karl Mark', role: 'Picking Staff', time: 'Today, 8:56 AM', kind: 'pick' },
  { id: 4, event: 'Reorder rule updated', reference: 'PAC-12000 seasonal factor', person: 'Belchez', role: 'Purchasing Manager', time: 'Yesterday, 4:20 PM', kind: 'settings' },
  { id: 5, event: 'Purchase order created', reference: 'PO-2026-0148', person: 'Belchez', role: 'Purchasing Manager', time: 'Yesterday, 2:35 PM', kind: 'order' },
];

export const initialWriteoffs = [];

export const pickTasks = [
  { id: 'PK-1042', order: 'SO-20481', productId: 'APF-CARBON', quantity: 8, lot: 'F-0417', location: 'C-02-06', expiry: 'Sep 16, 2026', priority: 'FEFO priority', customer: 'HomePlus Retail', dueInMinutes: 18 },
  { id: 'PK-1043', order: 'SO-20482', productId: 'PAC-12000', quantity: 2, lot: 'AC-8931', location: 'A-04-12', expiry: 'No expiry', priority: 'Standard', customer: 'Direct online order', dueInMinutes: 32 },
  { id: 'PK-1044', order: 'SO-20483', productId: 'TH-X200', quantity: 1, lot: 'TH-2160', location: 'B-01-03', expiry: 'No expiry', priority: 'Count check', customer: 'Luna Home Systems', dueInMinutes: 45 },
];

export const reorderRecommendations = [
  {
    id: 'PAC-12000',
    product: 'BreezePro 12,000 BTU Portable AC',
    onHand: 74,
    reorderPoint: 90,
    forecast: 180,
    suggestedOrder: 106,
    leadTime: '14 days',
    rule: 'Seasonal - 2.1x demand factor',
    status: 'Act now',
  },
  {
    id: 'TH-X200',
    product: 'ThermoLink X200 Smart Thermostat',
    onHand: 12,
    reorderPoint: 20,
    forecast: 45,
    suggestedOrder: 48,
    leadTime: '7 days',
    rule: 'Steady - demand + safety stock',
    status: 'Act now',
  },
  {
    id: 'APF-CARBON',
    product: 'PureAir Carbon Filter',
    onHand: 162,
    reorderPoint: 100,
    forecast: 120,
    suggestedOrder: 0,
    leadTime: '10 days',
    rule: 'Steady - healthy coverage',
    status: 'Monitor',
  },
];

export const seasonalOutlook = { peakSeasonWeeks: 6, projectedCoveragePercent: 92 };

export const formatNumber = (number) => new Intl.NumberFormat('en-PH').format(number);
