# 🏢 ResiFlow — Smart Residence Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-green.svg)](https://mongoosejs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

**ResiFlow (Smart Residence)** is an enterprise-ready residential society and facility management ecosystem built with a high-contrast ink-bordered aesthetic. It orchestrates multi-tenant society management, role-based access control with 2-Factor OTP verification, automated randomized credential onboarding, Google Gemini AI complaint analysis, staff slot scheduling, visitor QR passcodes, and maintenance tracking.

---

## 📑 Table of Contents

1. [High-Level System Architecture](#-high-level-system-architecture)
2. [Backend Architecture & Component Details](#-backend-architecture--component-details)
3. [Frontend Architecture & Component Details](#-frontend-architecture--component-details)
4. [Authentication & Onboarding Flow](#-authentication--onboarding-flow)
5. [Database & Entity-Relationship Model](#-database--entity-relationship-model)
6. [Key Features & Capabilities](#-key-features--capabilities)
7. [Tech Stack Matrix](#-tech-stack-matrix)
8. [Environment Setup & Installation](#-environment-setup--installation)
9. [Available Scripts](#-available-scripts)
10. [Folder Structure](#-folder-structure)

---

## 🏛️ High-Level System Architecture

```mermaid
flowchart TB
    subgraph ClientLayer["🖥️ Frontend Client Layer (React 19 + Vite)"]
        direction TB
        UI["Tailwind CSS + Neo-Brutalist UI\n(Lucide Icons, GSAP, Three.js 3D Sim)"]
        Router["React Router v7\n(Role Guards & Protected Routes)"]
        State["Redux Toolkit Store\n(Auth, Society Context, UI State)"]
        AxiosClient["Axios HTTP Service\n(withCredentials, Interceptors)"]
        
        UI --> Router
        Router --> State
        State --> AxiosClient
    end

    subgraph GatewayLayer["🌐 Network & API Gateway"]
        direction TB
        CORS["CORS & Cookie Parser"]
        RateLimit["Body Parsers & JSON Middleware"]
        AuthGuards["Role-Based Guard Middleware\n(SuperAdmin, Admin, Resident, Staff)"]
    end

    subgraph ServerLayer["⚙️ Backend Application Server (Express 5 + TypeScript)"]
        direction TB
        SuperAdminMod["SuperAdmin Module\n(Societies, Admins, Global Stats)"]
        AdminMod["Admin Module\n(Buildings, Flats, Residents, Staff)"]
        ResidentMod["Resident Module\n(Visitors, Complaints, Vehicles, Dues)"]
        StaffMod["Staff & Scheduling Module\n(Availability, Slots, Tasks)"]
        AIMod["Gemini AI Service\n(Drafting, Categorization, Urgency)"]
        MailService["Email Service Engine\n(Brevo REST API + SMTP Fallback)"]
    end

    subgraph StorageLayer["🗄️ Database & Cloud Infrastructure"]
        MongoDB[("🍃 MongoDB Database\n(Mongoose Schemas, Indexes, Pre-save Bcrypt)")]
        Cloudinary[("☁️ Cloudinary Storage\n(Avatars, Complaint Attachments)")]
        BrevoAPI["📬 Brevo Email Gateway / SMTP"]
        GeminiAPI["🧠 Google Gemini 2.0 Flash API"]
    end

    AxiosClient <==>|"REST APIs (JSON / Cookies)"| GatewayLayer
    GatewayLayer --> AuthGuards
    AuthGuards --> ServerLayer

    SuperAdminMod --> MongoDB
    AdminMod --> MongoDB
    ResidentMod --> MongoDB
    StaffMod --> MongoDB

    AdminMod -.->|"Credentials / Notices"| MailService
    ResidentMod -.->|"OTP / Updates"| MailService
    SuperAdminMod -.->|"Admin Credentials"| MailService

    MailService ==>|"Transactional Emails"| BrevoAPI
    ResidentMod ==>|"Attachments"| Cloudinary
    AIMod ==>|"Prompt Analysis"| GeminiAPI
```

---

## ⚙️ Backend Architecture & Component Details

The backend is structured around a modular domain-driven pattern inside `server/src/`, ensuring clean separation between Routing, Validation, Controller Logic, Middleware, and Database Models.

```mermaid
graph TD
    subgraph CoreEngine["Server Core (server/src/index.ts)"]
        ExpressApp["Express Application Instance"]
        Middlewares["Global Middlewares\n- cors({ credentials: true })\n- express.json()\n- cookieParser()"]
        ErrorHandler["Global Error Handler & ApiError Wrapper"]
    end

    subgraph SecurityModule["Security & Authentication Subsystem"]
        Guards["Guard Middlewares\n- SuperAdminGuard\n- AdminGuard\n- ResidentGuard\n- StaffGuard\n- AdminStaffGuard"]
        JWTUtil["JWT Engine (jwt.util.ts)\n- Access Token (Short-lived)\n- Refresh Token (Long-lived)\n- HTTP-only Cookies"]
        PasswordUtil["Password Engine (password.util.ts)\n- 6-Char Cryptographic Randomizer\n- Mongoose Pre-save Bcrypt Hashing"]
    end

    subgraph DomainModules["Feature Modules"]
        subgraph SuperAdmin["SuperAdmin Domain"]
            SARoute["/api/super-admin"] --> SAController["super-admin.controller.ts"]
            SAController --> SAModel["super-admin.schema.ts"]
        end

        subgraph Admin["Admin Domain"]
            ARoute["/api/admin"] --> AController["admin.controller.ts"]
            AController --> AModel["admin.schema.ts"]
        end

        subgraph ResidenceStructure["Society & Housing Hierarchy"]
            RRoute["/api/residence"] --> RModel["residence.model.ts"]
            BRoute["/api/building"] --> BModel["building.schema.ts"]
            FRoute["/api/flat"] --> FModel["flat.model.ts"]
        end

        subgraph UserDomains["User Domains"]
            ResRoute["/api/resident"] --> ResController["resident.controller.ts"] --> ResModel["resident.model.ts"]
            StaffRoute["/api/staff"] --> StaffController["staff.controller.ts"] --> StaffModel["staff.model.ts"]
        end

        subgraph OperationsDomains["Operations & Facility Domains"]
            CompRoute["/api/complaint"] --> CompController["complaint.controller.ts"] --> CompModel["complaint.model.ts"]
            NotRoute["/api/notice"] --> NotController["notice.controller.ts"] --> NotModel["notice.model.ts"]
            VisRoute["/api/visitor"] --> VisController["visitor.controller.ts"] --> VisModel["visitor.model.ts"]
            VehRoute["/api/vehicle"] --> VehController["vehicle.controller.ts"] --> VehModel["vehicle.model.ts"]
        end
    end

    subgraph Integrations["External Services & Helpers"]
        Mail["mail.util.ts\n- dispatchEmail()\n- sendAccountCredentialsMail()\n- sendOtpMail()\n- sendNoticeMail()"]
        AI["gemini.util.ts\n- GoogleGenAI SDK\n- Complaint analysis prompt"]
        Cloud["cloudinary.util.ts\n- Multer disk storage -> Cloudinary stream"]
    end

    ExpressApp --> Middlewares
    Middlewares --> SARoute & ARoute & RRoute & BRoute & FRoute & ResRoute & StaffRoute & CompRoute & NotRoute & VisRoute & VehRoute
    SARoute & ARoute & RRoute & BRoute & FRoute & ResRoute & StaffRoute & CompRoute & NotRoute & VisRoute & VehRoute --> Guards
    Guards --> SecurityModule
    SAController & ResController & StaffController --> PasswordUtil
    SAController & AController & ResController & StaffController --> Mail
    CompController --> AI
```

### Backend Highlights:
- **Async Safety**: All controllers are wrapped in `asyncHandler` with standard `ApiResponse` and `ApiError` formatters.
- **Dual Email Engine**: Brevo v3 HTTP API with automatic fallback to Nodemailer SMTP for flawless zero-drop transactional email delivery.
- **Automated Password Generation**: Cryptographically secure 6-character random alphanumeric passwords generated on creation for Admins, Residents, and Staff, immediately dispatched to their respective email inboxes while only the bcrypt hash is stored in MongoDB.

---

## 🖥️ Frontend Architecture & Component Details

The frontend client is built with **React 19**, **Vite**, **TypeScript**, and styled using an ink-bordered, neo-brutalist design with **Tailwind CSS v4**.

```mermaid
graph TD
    subgraph EntryPoint["Client Entry & Provider Tree"]
        Main["main.tsx"] --> Provider["Redux Provider (store.ts)"]
        Provider --> BrowserRouter["React Router Provider"]
        BrowserRouter --> App["App.tsx & ToastContainer"]
    end

    subgraph StateSubsystem["State Management (Redux Toolkit)"]
        Store["Root Store"]
        AuthSlice["authSlice.ts\n- user profile & role\n- isAuthenticated\n- token lifecycle"]
        UISlice["uiSlice.ts\n- active modals\n- sidebar state\n- notifications"]
        Store --> AuthSlice & UISlice
    end

    subgraph RouteGuards["Routing & Access Control"]
        AppRoutes["Routes Definition"]
        PublicRoutes["Public Views\n- LandingPage\n- Unified Login\n- OTP Verification"]
        ProtectedRoutes["Protected Role Gateways"]
        
        AppRoutes --> PublicRoutes
        AppRoutes --> ProtectedRoutes
        
        ProtectedRoutes -->|"Role: super_admin"| SuperAdminViews["SuperAdmin Dashboard\n- Societies Management\n- Admin Onboarding\n- Global Metrics"]
        ProtectedRoutes -->|"Role: admin"| AdminViews["Admin Dashboard\n- Buildings & Flats Matrix\n- Resident Onboarding\n- Staff Scheduling\n- Notice Broadcasting"]
        ProtectedRoutes -->|"Role: resident"| ResidentViews["Resident Portal\n- My Flat & Family\n- Visitor Passes & QR Codes\n- AI Complaint Lodging\n- Maintenance Payments"]
        ProtectedRoutes -->|"Role: staff"| StaffViews["Staff Portal\n- Work Shift Matrix\n- Assigned Task Queue\n- Gate Pass Check-in"]
    end

    subgraph UIComponents["Reusable Design System Components"]
        Nav["Navbar & User Profile Menu"]
        Sidebar["Ink-Bordered Sidebar Navigation"]
        Modals["Action Modals\n- OnboardResidentModal\n- OnboardStaffModal\n- CreateAdminModal\n- PaymentModal\n- VisitorPassModal"]
        Visuals["Visual Enhancements\n- Three.js Interactive 3D Residence\n- Interactive Simulator\n- Confetti Celebration Engine"]
    end

    App --> RouteGuards
    ProtectedRoutes -.-> Nav & Sidebar & Modals
```

---

## 🔐 Authentication & Onboarding Flow

ResiFlow uses a secure **Two-Step Authentication (2FA)** pipeline for logging in, coupled with an **Automated Randomized Password & Email Onboarding** flow for new members.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Society Admin / Super Admin
    actor User as Resident / Staff / Admin
    participant Client as ResiFlow Frontend
    participant Server as Express Server
    participant DB as MongoDB
    participant Brevo as Brevo / Mail Service

    Note over Admin, Brevo: 1. Automated Account Creation & Onboarding
    Admin->>Client: Fills Onboarding Form (Name, Email, Phone, Unit)
    Client->>Server: POST /api/{role} (without manual password)
    Server->>Server: Generate Secure 6-Char Password (crypto.randomBytes)
    Server->>Server: Hash Password with Bcrypt (cost 10)
    Server->>DB: Save User with Hashed Password
    Server->>Brevo: Dispatch Email with 6-Char Plaintext Password
    Brevo-->>User: Welcome Email with Temporary Credentials
    Server-->>Client: 201 Created ("Credentials Dispatched")

    Note over User, Brevo: 2. Login Flow (2FA Verification)
    User->>Client: Enter Email & 6-Char Password
    Client->>Server: POST /api/auth/login
    Server->>DB: Find user by email (+password select)
    Server->>Server: Verify Bcrypt Hash
    Server->>Server: Generate 6-Digit OTP (Expires in 10 mins)
    Server->>DB: Store OTP Hash & Expiration
    Server->>Brevo: Dispatch 6-Digit OTP to User Email
    Brevo-->>User: 2FA Login OTP Email
    Server-->>Client: 200 OK (requiresOtp: true)
    
    User->>Client: Enter 6-Digit OTP
    Client->>Server: POST /api/auth/verify-otp
    Server->>DB: Validate OTP & check expiry
    Server->>Server: Generate Access Token (15m) & Refresh Token (7d)
    Server->>Client: Set HTTP-Only Secure Cookies + Return User Profile
    Client->>Client: Update Redux Auth State
    Client-->>User: Redirect to Role-Specific Dashboard
```

---

## 🗄️ Database & Entity-Relationship Model

```mermaid
erDiagram
    SuperAdmin ||--o{ Residence : creates
    SuperAdmin ||--o{ Admin : provisions
    Residence ||--|| Admin : managed_by
    Residence ||--o{ Building : contains
    Building ||--o{ Flat : contains
    
    Flat ||--o{ Resident : houses
    Residence ||--o{ Staff : employs
    
    Resident ||--o{ Complaint : files
    Residence ||--o{ Complaint : scoped_to
    Staff ||--o{ Complaint : assigned_to
    
    Resident ||--o{ Visitor : pre_approves
    Resident ||--o{ Vehicle : registers
    
    Admin ||--o{ Notice : broadcasts
    Residence ||--o{ Notice : targeted_to
    
    Staff ||--o{ StaffSlot : scheduled_in

    Residence {
        ObjectId _id
        string name
        string addressLine
        string city
        string state
        string pincode
        ObjectId admin
        number totalResidents
        number totalFlats
        boolean isActive
    }

    Admin {
        ObjectId _id
        string name
        string email
        string phone
        string password
        ObjectId residence
        string role
        boolean isActive
    }

    Building {
        ObjectId _id
        string name
        number totalFloors
        ObjectId residence
    }

    Flat {
        ObjectId _id
        string flatNumber
        number floor
        ObjectId building
        ObjectId owner
        ObjectId tenant
        string status
    }

    Resident {
        ObjectId _id
        string name
        string email
        string phone
        string password
        ObjectId flat
        string residentType
        boolean isActive
    }

    Staff {
        ObjectId _id
        string name
        string email
        string phone
        string employeeId
        string role
        string department
        ObjectId residence
        string availabilityStatus
        boolean isActive
    }

    Complaint {
        ObjectId _id
        string title
        string description
        string category
        string priority
        string status
        ObjectId resident
        ObjectId residence
        ObjectId assignedStaff
        string aiSummary
    }

    Notice {
        ObjectId _id
        string title
        string content
        string category
        string priority
        boolean isPinned
        ObjectId residence
        ObjectId createdBy
    }

    Visitor {
        ObjectId _id
        string name
        string phone
        string purpose
        string entryCode
        string status
        ObjectId resident
        ObjectId flat
        Date expectedArrival
    }

    Vehicle {
        ObjectId _id
        string vehicleNumber
        string vehicleType
        string model
        string parkingSlot
        ObjectId resident
    }
```

---

## 🌟 Key Features & Capabilities

| Module | Features |
|---|---|
| **Multi-Tenancy** | Independent societies managed by assigned Admins under SuperAdmin supervision. |
| **Randomized Onboarding** | 6-character random password auto-generation dispatched straight to user inboxes. |
| **Two-Factor Authentication** | Dual-step email OTP verification on every login for all roles. |
| **AI Complaint Assistant** | Google Gemini 2.0 integration for auto-categorizing issues and assessing urgency. |
| **Smart Staff Slotting** | Working hour matrices, duty shifts, and slot availability tracking. |
| **Visitor Pass & QR** | Pre-approvals with verification passcodes and live guard check-in. |
| **Financial Simulator** | Interactive dues tracking, monthly maintenance billing, and payment simulation. |
| **Notice Broadcasts** | Emergency and general announcements with instant multi-resident email dispatch. |
| **Interactive 3D Simulator** | Three.js interactive building and society rendering on the portal homepage. |

---

## 🛠️ Tech Stack Matrix

### Frontend
- **Framework**: React 19 (TypeScript) + Vite 8
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4, Remix Icon, Lucide React
- **Animations & Visuals**: Three.js, GSAP, Canvas Confetti
- **HTTP Client**: Axios with interceptors and cookie credentials

### Backend
- **Runtime & Framework**: Node.js + Express 5 (TypeScript)
- **Database & ODM**: MongoDB + Mongoose 9
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcrypt` password hashing, `cookie-parser`
- **Email Delivery**: Brevo v3 REST API (`@getbrevo/brevo` compatible endpoints) + Nodemailer SMTP fallback
- **Artificial Intelligence**: `@google/genai` (Gemini 2.0 Flash)
- **File Uploads**: Cloudinary SDK + Multer
- **Validation & CLI**: Zod, Inquirer

---

## 🚀 Environment Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB community instance or MongoDB Atlas cluster URI

---

### 1. Backend Setup (`/server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` in `server/.env`:
   ```env
   PORT=5000
   DB_URL=mongodb://127.0.0.1:27017/smart-residence
   
   # JWT Configuration
   JWT_ACCESS_SECRET=your_super_secret_access_jwt_key_12345
   JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_67890
   
   # Email Service (Brevo API & SMTP Fallback)
   BREVO_API_KEY=your_brevo_v3_api_key_here
   BREVO_USER=your_verified_sender_email@domain.com
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_EMAIL=your_smtp_login_here
   SMTP_PASS=your_smtp_password_here
   
   # AI Integration (Optional for AI complaint analysis)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Cloudinary (Optional for file uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Seed the initial Super Admin account:
   ```bash
   npm run seed:admin
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---

### 2. Frontend Setup (`/client`)

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` in `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

### In `/server`
- `npm run dev` — Starts server with nodemon hot-reload.
- `npm run build` — Compiles TypeScript into JavaScript inside `dist/`.
- `npm start` — Runs the compiled production server.
- `npm run seed:admin` — Interactive CLI prompt to initialize the Super Admin.

### In `/client`
- `npm run dev` — Starts the Vite development server.
- `npm run build` — Type-checks and builds the production bundle into `dist/`.
- `npm run preview` — Locally preview the production build.

---

## 📁 Folder Structure

```
SmartResidence/
├── client/                     # React 19 Frontend
│   ├── src/
│   │   ├── assets/             # Static images and icons
│   │   ├── components/         # Reusable UI components & modals
│   │   │   ├── Modals/         # Form and payment modals
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── InteractiveSimulator.tsx
│   │   ├── pages/              # Route views
│   │   │   ├── auth/           # Login & 2FA OTP pages
│   │   │   ├── dashboard/      # SuperAdmin & Admin dashboards
│   │   │   ├── residents/      # Resident management
│   │   │   ├── staff/          # Staff & slot management
│   │   │   ├── complaints/     # AI complaints desk
│   │   │   ├── visitors/       # Visitor log & QR passes
│   │   │   ├── vehicles/       # Parking & vehicles
│   │   │   └── landing/        # Landing page with 3D residence
│   │   ├── redux/              # Redux slices & store configuration
│   │   ├── services/           # Axios instance & API caller methods
│   │   ├── App.tsx             # Root router & layout wrapper
│   │   └── main.tsx            # React application entry
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── admin/              # Society Admin controller & schema
│   │   ├── super-admin/        # Platform SuperAdmin controller & schema
│   │   ├── residence/          # Society instances & settings
│   │   ├── building/           # Building & tower management
│   │   ├── flat/               # Flat units & occupancy
│   │   ├── resident/           # Resident controller & schema
│   │   ├── staff/              # Staff & scheduling services
│   │   ├── complaint/          # Complaints desk & AI integration
│   │   ├── notice/             # Society bulletin broadcast
│   │   ├── visitor/            # Visitor passcodes & check-in
│   │   ├── vehicle/            # Vehicle registry & parking
│   │   ├── middleware/         # Guard & auth middlewares
│   │   ├── utils/              # Mail, JWT, Password, Gemini & Cloudinary helpers
│   │   ├── scripts/            # CLI database seeding scripts
│   │   └── index.ts            # Express server initialization
│   └── package.json
│
└── README.md                   # Project documentation
```

---

## 📄 License

This project is licensed under the **MIT License**.
