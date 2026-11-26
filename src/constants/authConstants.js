export const DEMO_OTP_CODE = '482916';

export const SCREEN_STATES = {
  SPLASH: 'SPLASH',
  LOGIN: 'LOGIN',
  REGISTER_PERSONAL: 'REGISTER_PERSONAL',
  REGISTER_OTP: 'REGISTER_OTP',
  REGISTER_PASSWORD: 'REGISTER_PASSWORD',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  PASSWORD_RESET: 'PASSWORD_RESET',
  DASHBOARD: 'DASHBOARD',
};

export const USER_ROLES = [
  {
    id: 'supervisor',
    label: 'Supervisor',
    shortDesc: 'Site execution, labour attendance & stock requests',
    approver: 'Site / Project Manager',
  },
  {
    id: 'engineer',
    label: 'Engineer',
    shortDesc: 'Technical execution & QA/QC reports',
    approver: 'Site / Project Manager',
  },
  {
    id: 'store_keeper',
    label: 'Store Keeper',
    shortDesc: 'Inventory master stock & material dispatch',
    approver: 'Site / Project Manager',
  },
  {
    id: 'accounts',
    label: 'Accounts Dept.',
    shortDesc: 'Labour wages & vendor payment processing',
    approver: 'Site / Project Manager',
  },
  {
    id: 'manager',
    label: 'Site / Project Manager',
    shortDesc: 'Milestones, approvals & Admin overview reports',
    approver: 'Admin',
  },
];

export const LOGIN_ROLES = [
  ...USER_ROLES,
  {
    id: 'admin',
    label: 'Admin',
    shortDesc: 'Executive oversight & manager approvals',
    approver: 'System Root',
  },
];

export const DEMO_LOGIN_ACCOUNTS = [
  {
    id: 'supervisor',
    label: 'Supervisor',
    name: 'Site Supervisor',
    email: 'supervisor@structra.in',
    initials: 'SS',
    tag: 'Field & Attendance',
  },
  {
    id: 'engineer',
    label: 'Engineer',
    name: 'Site Engineer',
    email: 'engineer@structra.in',
    initials: 'SE',
    tag: 'Tasks & QA Reports',
  },
  {
    id: 'manager',
    label: 'Site / Project Manager',
    name: 'Project Manager',
    email: 'manager@structra.in',
    initials: 'PM',
    tag: 'Approvals & Overviews',
  },
  {
    id: 'store_keeper',
    label: 'Store Keeper',
    name: 'Store Keeper',
    email: 'storekeeper@structra.in',
    initials: 'SK',
    tag: 'Stock & Issue',
  },
  {
    id: 'accounts',
    label: 'Accounts Dept.',
    name: 'Accounts Officer',
    email: 'accounts@structra.in',
    initials: 'AC',
    tag: 'Labour Payouts',
  },
  {
    id: 'admin',
    label: 'Admin',
    name: 'System Admin',
    email: 'admin@structra.in',
    initials: 'AD',
    tag: 'Executive & Manager Gate',
  },
];
