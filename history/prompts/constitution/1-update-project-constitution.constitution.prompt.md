---
id: 1
title: update-project-constitution
stage: constitution
date: 2026-01-12
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: user
command: sp.constitution
labels: [constitution,setup,spec-driven-development]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

```
text
# Constitution: Main Agent and Sub-Agents Setup

You are the Main Agent in charge of building a full-stack Todo Web Application using Spec-Driven Development and Cloud-Native AI principles. You are assisted by four Sub-Agents, each with clear responsibilities and skills.

Main Agent Role:
- Orchestrate all Sub-Agents
- Ensure all specs (@specs/features, @specs/api, @specs/database, @specs/ui) are implemented
- Integrate frontend, backend, database, and authentication seamlessly
- Validate that the app is functional, modern, responsive, and secure

Sub-Agents:

1. Frontend Agent
   - Skills: Next.js 16+, App Router, TypeScript, Tailwind CSS, responsive UI design
   - Responsibilities: Implement all pages, components, and API calls using JWT for auth
   - Ensure modern, attractive UI and proper UX

2. Backend Agent
   - Skills: Python FastAPI, SQLModel, RESTful API design, JWT verification
   - Responsibilities: Implement all API endpoints (/api/{user_id}/tasks, CRUD operations), secure routes with JWT, return JSON responses

3. Database Agent
   - Skills: Neon Serverless PostgreSQL, SQLModel, schema design, indexes, relations
   - Responsibilities: Implement database models, create tasks and users tables, manage migrations, ensure query performance

4. Authentication Agent
   - Skills: Better Auth (JS/TS), JWT token management, session handling
   - Responsibilities: Implement signup/login on frontend, JWT issuance, token verification on backend, protect all routes

Constraints:
- Use only Neon PostgreSQL for storage
- Do not perform any manual coding
- Generate complete modern UI
- Enforce task ownership per user
- Follow spec-driven development strictly
```

## Response snapshot

The project constitution has been successfully updated to reflect the Todo Web Application architecture with four Sub-Agent setup. The new constitution includes:

1. Core Principles:
   - Spec-Driven Development (NON-NEGOTIABLE)
   - Full-Stack Integration
   - Sub-Agent Orchestration
   - Modern Web Standards
   - Secure Authentication & Authorization
   - Database-First Design

2. Technical Constraints
3. Development Workflow
4. Governance section

The constitution now properly reflects the architecture for building a full-stack Todo Web Application with Spec-Driven Development principles, using Next.js for frontend, FastAPI for backend, Neon PostgreSQL for database, and Better Auth for authentication.

## Outcome

- ✅ Impact: Updated project constitution with clear principles for Todo Web App development
- 🧪 Tests: none
- 📁 Files: 1 file updated (.specify/memory/constitution.md)
- 🔁 Next prompts: Development can now proceed with clear architectural guidelines
- 🧠 Reflection: Constitution now properly reflects the multi-agent architecture with clear responsibilities

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin with feature specification using /sp.specify