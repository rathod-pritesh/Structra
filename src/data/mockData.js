export const MOCK_USER = {
  name: 'Aarav Patel',
  role: 'Chief Project Director',
  department: 'Gujarat Infra & Structural Operations',
  company: 'Structra Infra Gujarat Ltd',
  email: 'aarav.patel@structra.in',
  licenseNo: 'GJ-AMD-884920',
  initials: 'AP',
};

export const MOCK_STATS = {
  activeProjects: 4,
  pendingTasks: 3,
  completedTasks: 8,
  workforceOnSite: 0,
};

export const MOCK_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Shivalik Skyview Corporate Tower',
    category: 'Commercial High-Rise',
    location: 'SG Highway, Bodakdev, Ahmedabad',
    progress: 74,
    status: 'In Progress',
    statusVariant: 'success',
    phase: 'RCC Structural Framing • Level 22',
    deadline: 'Dec 2026',
  },
  {
    id: 'proj-2',
    name: 'Riverfront Promenade Residency',
    category: 'Premium Waterfront Township',
    location: 'Sabarmati Riverfront, Ashram Road, Ahmedabad',
    progress: 42,
    status: 'On Schedule',
    statusVariant: 'success',
    phase: 'Podium Slab & Foundation Pouring',
    deadline: 'May 2027',
  },
  {
    id: 'proj-3',
    name: 'GIFT City Financial Gateway',
    category: 'FinTech Corporate Hub',
    location: 'GIFT City Corridor, Gandhinagar - Ahmedabad',
    progress: 88,
    status: 'Near Completion',
    statusVariant: 'accent',
    phase: 'Glass Facade & MEP Rough-In',
    deadline: 'Mar 2027',
  },
  {
    id: 'proj-4',
    name: 'Sindhu Bhavan Business Park',
    category: 'Commercial Retail & Offices',
    location: 'Sindhu Bhavan Road (SBR), Thaltej, Ahmedabad',
    progress: 19,
    status: 'Site Prep',
    statusVariant: 'neutral',
    phase: 'Basement Excavation & Diaphragm Wall',
    deadline: 'Oct 2027',
  },
];

export const MOCK_TASKS = [
  {
    id: 'task-1',
    title: 'Ultrasonic Weld QA & Column Alignment',
    project: 'Shivalik Skyview Corporate Tower',
    priority: 'High',
    dueDate: 'Today, 2:30 PM',
    completed: false,
    assignedTo: 'Chirag Shah (Lead QA)',
  },
  {
    id: 'task-2',
    title: 'M40 Ready-Mix Concrete Slump & Cube Test',
    project: 'Riverfront Promenade Residency',
    priority: 'High',
    dueDate: 'Tomorrow, 9:00 AM',
    completed: false,
    assignedTo: 'Mehul Prajapati (Site Engineer)',
  },
  {
    id: 'task-3',
    title: 'Diaphragm Wall Shoring Anchor Inspection',
    project: 'Sindhu Bhavan Business Park',
    priority: 'Medium',
    dueDate: 'Nov 14, 2026',
    completed: false,
    assignedTo: 'Hardik Joshi (Geotech Lead)',
  },
];

// Empty inventory & attendance arrays ready for backend connection
export const MOCK_INVENTORY = [];
export const MOCK_INVENTORY_LOG = [];
export const MOCK_ATTENDANCE = [];
