<!-- SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0
Modified principles: None (new constitution created)
Added sections: All sections based on user input
Removed sections: Template placeholders
Templates requiring updates: N/A (first version)
Follow-up TODOs: None
-->
# Todo Web Application Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
Every feature must be defined in a spec document before implementation begins; All specs (@specs/features, @specs/api, @specs/database, @specs/ui) must be approved before coding; Implementation must strictly follow the spec with no deviations without spec updates.

### II. Full-Stack Integration
Frontend (Next.js 16+, App Router, TypeScript, Tailwind CSS) and backend (Python FastAPI, SQLModel) must be developed in parallel with continuous integration; Database (Neon Serverless PostgreSQL) schema changes must be coordinated with API endpoint implementations; Authentication (Better Auth) must be integrated seamlessly across all layers.

### III. Sub-Agent Orchestration
Main Agent coordinates all Sub-Agent activities; Each Sub-Agent (Frontend, Backend, Database, Authentication) follows assigned responsibilities without overlapping; Integration checkpoints ensure seamless connection between all components.

### IV. Modern Web Standards
Application must use contemporary web technologies (Next.js 16+, TypeScript, Tailwind CSS); Responsive UI design required for all screen sizes; RESTful API design with proper error handling and documentation.

### V. Secure Authentication & Authorization
JWT-based authentication must be implemented consistently across frontend and backend; All API routes must be secured with proper JWT verification; User session management must follow security best practices with proper token handling.

### VI. Database-First Design
Database schema (Neon PostgreSQL with SQLModel) designed before API implementation; Proper indexing and relations established for optimal performance; Data integrity and task ownership per user enforced at the database level.

## Technical Constraints
- Use only Neon PostgreSQL for storage
- Enforce task ownership per user with proper foreign key relationships
- Implement proper error handling and validation across all layers
- Maintain consistent data models across frontend, backend, and database
- Ensure proper API rate limiting and security headers

## Development Workflow
- Follow Spec-Driven Development methodology with spec → plan → tasks progression
- All code changes must pass automated tests before merging
- Frontend, backend, and database changes must be tested together
- Authentication flows must be validated in integration tests
- Code reviews required for all pull requests with focus on security and spec compliance

## Governance
Constitution governs all development activities and supersedes any conflicting practices; All architectural decisions must align with these principles; Amendments require formal approval process with impact assessment; Code quality tools must enforce these standards through CI/CD pipelines.

**Version**: 1.1.0 | **Ratified**: 2026-01-12 | **Last Amended**: 2026-01-12