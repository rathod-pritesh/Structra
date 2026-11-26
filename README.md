# Structra

Structra is a React Native and Expo mobile app for managing construction sites, material stock, labour attendance, and daily reports across field teams, managers, store keepers, accounts, and admins.

> **Current Phase:** Frontend UI & Role Workflows complete. Backend services (**Java**) and database (**TiDB Cloud**) will be integrated in the next phase, so all screens currently start with clean empty states.

---

## User Roles

The app separates navigation and screens for 6 different user roles:

- **Supervisor** — Marks daily labour attendance, submits attendance sheets to Accounts, requests site materials, and uploads progress reports.
- **Engineer** — Tracks assigned projects and site QA/structural tasks, and submits technical PDF/Excel reports.
- **Site / Project Manager** — Creates and manages projects, approves/rejects material requisitions, approves field user signups, and consolidates reports into Admin overviews.
- **Store Keeper** — Manages warehouse stock (`Add Stock`), issues Manager-approved material requests to Supervisors, and maintains the dispatch log.
- **Accounts Dept.** — Reviews submitted attendance sheets, checks worker wage breakdowns, and releases labour payments.
- **Admin** — Reviews consolidated project overviews from Managers and approves Site / Project Manager account requests.

---

## What's Implemented

### 1. Role-Based Auth & Approval Gate
- Animated splash screen on launch.
- Login screen with role selection (`Account Role` pills) and **Quick Role Demo Login** cards to jump straight into any role's UI for testing.
- 3-step registration flow:
  1. Full name, email, and role selection (shows who approves the request).
  2. Email OTP verification (demo OTP: `482916`).
  3. Password setup with live strength checklist.
- **Pending Approval Gate:** New accounts wait in an approval queue (`Site / Project Manager` approves field roles; `Admin` approves Managers).
- Password reset flow.

### 2. Material Requisition & Warehouse Dispatch
- **Store Keeper** adds and tracks warehouse stock by category (`Structural`, `Masonry`, `Electrical`) with low-stock alerts.
- **Supervisor** submits material requests (`RequestMaterialModal`) tied to a project and purpose.
- **Site / Project Manager** approves or rejects requests from the **Approvals** tab.
- **Store Keeper** issues approved requests, which deducts stock automatically and logs the entry in **Recent Material Dispatch**.

### 3. Labour Attendance & Wage Payout
- **Supervisor** enrolls site workers with trade and daily wage (`AddWorkerModal`) and toggles daily status (`Present`, `Half-Day`, `Absent`) with live wage calculation.
- **Supervisor** submits the attendance sheet to the Accounts Department.
- **Accounts Dept.** reviews the worker-by-worker wage breakdown and releases payment (`Pending Payout` → `Released`).

### 4. Site Reporting Flow (PDF & Excel)
- **Engineers** and **Supervisors** submit site reports (`SubmitReportModal`) tagged as `PDF (.pdf)` or `Excel (.xlsx)`.
- **Site / Project Manager** collects pending field reports, adds an executive summary note, and sends a consolidated package to **Admin**.
- **Admin** reviews the overview package and marks it reviewed.

---

## Running Locally

### Prerequisites
- Node.js
- Expo Go app on Android or iOS

### Setup
```bash
git clone https://github.com/rathod-pritesh/Structra.git
cd Structra
npm install
```

### Start the App
```bash
npm start
```

If Expo Go shows a network error (`Failed to download the remote update`) due to firewall, Wi-Fi isolation, or virtual network adapters on Windows, run with tunnel mode instead:
```bash
npm run tunnel
```
*(or `npx expo start --tunnel ngrok`)*

### Quick Testing Tip
- Session data stays in memory when you log out (`Profile → Log Out`), so you can log in as **Store Keeper** or **Supervisor**, create items/requests, log out, and switch to **Manager**, **Accounts Dept.**, or **Admin** to approve and process them.

---

## Folder Structure

```text
Structra/
├── App.js                        # Auth routing & shared session state
├── src/
│   ├── components/               # Reusable inputs, buttons, modals, bottom bar, cards
│   ├── constants/                # Colors, auth states, role definitions, logos
│   ├── data/                     # Empty initial state placeholders for backend hookup
│   ├── screens/                  # Auth screens, Dashboard, Projects, Inventory, Tasks, Approvals, Profile
│   └── utils/                    # Form & password validation helpers
└── package.json
```

---

## Tech Stack
- **Mobile Frontend:** React Native (`0.88.1`) with Expo (`~58.0.26`), JavaScript (JSX)
- **Tunneling:** `@expo/ngrok`
- **Planned Backend:** Java
- **Planned Database:** TiDB Cloud

---

## Next Steps
- Build the **Java** backend REST APIs for authentication, role-based access, and approval workflows.
- Connect **TiDB Cloud** to persist user accounts, projects, inventory stock/dispatches, attendance/payroll records, and uploaded reports (`.pdf` / `.xlsx`).
