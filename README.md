# Clarity
A modern, multi-tenant project management platform built with the MERN stack. Clarity delivers distinct, role-based experiences for administrators and employees, featuring passwordless authentication, frictionless team onboarding, and intelligent task management.

<img width="1255" height="675" alt="Clarity1" src="https://github.com/user-attachments/assets/f7d63384-7723-4b98-a699-bc1cee18bfb4" />
<img width="1261" height="673" alt="Clarity2" src="https://github.com/user-attachments/assets/07d72cc6-b020-4d06-9130-5268faa21969" />
<img width="1277" height="677" alt="Clarity3" src="https://github.com/user-attachments/assets/81baa7ec-ec99-4c3c-abad-89d937cb552b" />



## Overview
Clarity solves the problem of generic, one-size-fits-all project management tools. Instead of forcing every user into the same dashboard, Clarity adapts the interface and capabilities based on the user's contextual role within each workspace.

* **Administrators** see macro metrics: team velocity, project health scores, and resource bottlenecks.
* **Employees** see micro execution: a focused view of their top three priorities, upcoming deadlines, and one-click blocker reporting.

Built with strict adherence to the Single Responsibility Principle, Clarity is designed for scale, security, and maintainability.

## Key Features
### Phase 1: Role-Based Auth Routing
* Contextual role system stored in `WorkspaceMember`, not the global user model.
* Automatic post-login routing: Setup, Active, or Invite flow.
* Secure token rotation with HMAC hashed refresh tokens.
* OTP-based 2FA for password-authenticated users.

### Phase 2: Inverted Admin Setup Flow
* Team First, Tasks Second architecture.
* Workspace creation with slug-based URLs.
* Project management with timeline tracking.
* Task assignment with priority and due date enforcement.
* Strict permission checks at the service layer.

### Phase 3: Frictionless Employee Invites
* Magic Link invitation system with stateless JWT tokens.
* Passwordless account creation for invited employees.
* Daily passwordless login via secure email links.
* Atomic invite acceptance: create user, assign role, and login in one flow.
* Invite revocation with cross-tenant security validation.

### Phase 4: Distinct Dashboard Experiences
* **Admin Dashboard:** MongoDB aggregation pipelines for real-time metrics, open tasks count, completed today counter, and resource bottleneck identification.
* **Employee Dashboard:** Focus Mode with top three priority tasks, optimistic UI updates for blocker reporting, and upcoming deadlines list.

## System Architecture

The backend is structured around the Single Responsibility Principle using a strict layered architecture:

* **Controllers:** Handle HTTP requests, parse parameters, and invoke Zod validators.
* **Services:** Execute core business logic, enforce Role-Based Access Control, and orchestrate data flow.
* **Repositories:** Encapsulate all Mongoose database queries and aggregation pipelines.
* **Mappers:** Transform raw Mongoose documents into clean Data Transfer Objects before they reach the client.

## Security and Performance Engineering

* **TOCTOU Prevention:** Password reset and OTP verification flows utilize atomic Redis Lua scripts. This guarantees that checking a token and deleting it happens in a single, indivisible execution cycle, completely eliminating Time-of-Check to Time-of-Use race conditions.
* **XSS Mitigation:** Access tokens are never stored in LocalStorage. They exist purely in frontend memory via Zustand. Session persistence across reloads is handled securely via HttpOnly refresh token cookies.
* **Database Optimization:** The Admin Dashboard relies on MongoDB Aggregation Pipelines utilizing `$facet`, `$group`, and `$lookup`. This pushes heavy metric calculations and user joins to the database layer, preventing Node.js event loop blocking and N+1 query problems.
* **Rate Limiting and Sanitization:** Redis and custom middleware are used to enforce strict rate limits on authentication endpoints. All incoming payloads are sanitized to prevent NoSQL injection and cross-site scripting attacks.

## Tech Stack
**Backend**
* **Runtime:** Node.js with ES Modules
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Caching and Session Store:** Redis
* **Atomic Operations:** Redis Lua Scripts
* **Validation:** Zod for runtime type safety
* **Authentication:** JSON Web Tokens with HMAC refresh token hashing
* **Email:** Nodemailer with background job handling
* **Logging:** Winston for structured logging
* **Security:** Helmet, CORS, rate limiting, and input sanitization

**Frontend**
* **Framework:** React with TypeScript
* **State Management:** Zustand for lightweight global state
* **Routing:** React Router with protected route guards
* **Styling:** Tailwind CSS for utility-first design
* **HTTP Client:** Axios with interceptors for token management

**DevOps and Tooling**
* **Environment Management:** dotenv with schema validation
* **Testing:** Postman collections for API validation
* **Type Safety:** Strict TypeScript configuration across all layers

### Contextual Identity Model
Users do not have a global role field. Instead, permissions are determined by the `WorkspaceMember` document that links a user to a specific workspace:
```javascript
interface IWorkspaceMember {
  workspace: ObjectId;
  user: ObjectId;
  role: "admin" | "member";
  joinedAt: Date;
}
```
This architecture enables a single user to be an admin in one workspace and a member in another, with perfect isolation between tenants.
### Data Transfer Objects
All services return clean DTOs, never raw Mongoose documents:
```javascript
interface TaskDto {
  _id: string;
  title: string;
  project: { _id: string; name: string };
  assignee: { _id: string; name: string; email: string };
  status: "todo" | "in_progress" | "blocked" | "done";
  priority: "low" | "medium" | "high";
  dueDate: Date;
}
```

### Single Responsibility Principle
Every domain has its own dedicated files:
```javascript
src/
├── models/          # Mongoose schemas and TypeScript interfaces
├── repositories/    # Database queries only, no business logic
├── services/        # Business logic, orchestration, DTO mapping
├── validators/      # Zod schemas for request validation
├── controllers/     # HTTP request/response handling
├── routes/          # Express route definitions
├── middlewares/     # Authentication, sanitization, rate limiting
├── utils/           # JWT utilities, error classes, logger
├── config/          # Environment and database configuration
└── helper/          # Response formatters and shared utilities
```
## Authentication Flow
### Password-Based Login (Admins)
- User submits email and password to /users/otp-requests
- Backend verifies credentials and sends OTP via email
- User submits OTP to /users/sessions
- Backend verifies OTP, builds UserContext, and issues tokens
- Frontend stores tokens and routes based on workspaceStatus
### Magic Link Login (Employees)
- User clicks invite link or requests magic login
- Frontend extracts token from URL and sends to /users/magic-login/verify or /invites/accept
- Backend verifies token, handles account creation if needed, assigns workspace role
- Backend issues standard access and refresh tokens
- Frontend stores tokens and routes to active dashboard
### Token Management
- Access tokens: 15 minutes, stored in memory by frontend
- Refresh tokens: 7 days, stored in HTTP-only cookie with HMAC hashing
- Rotation: Each refresh invalidates the previous token to prevent replay attacks
