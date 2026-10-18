[Project Name]

A cost-aware AI workspace that turns your project workflow into a living design document and a shareable portfolio.

Status: MVP in progress · Platform: iOS / Android / Web (Expo) · Tracks: StepUp pathway · Creao AWS contribution

Table of Contents
The Problem
What It Does
MVP Scope
How It Works
Permission Model
Tech Stack
Getting Started
Environment Variables
Project Structure
Security Notes
Hackathon Tracks
Roadmap
Team
The Problem

People who are new to building with AI face two obstacles:

Pricing is opaque. Costs depend on the model, the token counts of each prompt and response, and how many agent calls a task triggers. Beginners often have no idea what a project will cost until the bill arrives.
Projects lose their story. Design decisions, prompts, and changes get scattered, so it is hard to document a project or show it off later.
What It Does

[Project Name] gives you one place to prompt AI models, watch what you are spending, and keep a design document that stays in sync with the rest of your workflow.

Prompt short or long. Send a quick question or a long request such as "decide the structure of my website."
Prompt optimization. Each prompt can first pass through an optimizer agent (your own, or a default general agent) before reaching the model. You see the before and after and choose which to send.
Cost tracking. Every prompt is priced. The app shows spend per prompt, per agent, and per project, plus a predicted range for the project total.
Design document as source of truth. The LLM can propose edits to a project design document, and approved changes can be reflected across the workflow.
Auto-generated documentation. The app helps produce documentation so a project can tell its own story.
Agents with skills. Create agents with custom skills, stored in the cloud database.
Virtual portfolio. Share your projects from your phone, for example when talking to a company or internship team.
MVP Scope

Included in the first version:

 Sign-in with Supabase Auth
 One project with a design document
 Two selectable models plus a default
 Per-prompt cost meter with a predicted range and spending cap
 Proposed edits to the design document, shown as a diff, then approved or rejected
 Auto-generated project documentation

Planned after the MVP:

 Automated GitHub issues from design document changes
 Email and calendar events from team workflows
 Prebuilt agent templates for companies and internship teams
 Shareable read-only portfolio links
How It Works
 Expo app (client)
      │  prompt
      ▼
 Optimizer agent (optional) ──► shows original vs. optimized prompt
      │  approved prompt
      ▼
 Model router (default model or user's choice)
      │  response + token usage
      ▼
 Cost tracker ──► per-prompt / per-agent / per-project totals
      │
      ▼
 Design document ◄── proposed edit (diff) ◄── agent or user
      │  approved change
      ▼
 Workflow actions (docs, later: GitHub issues, email, calendar)

Cost estimates are ranges, not exact numbers. Output length is unknown before a model responds, and agent loops multiply calls. The app shows an estimated range before a run and the actual cost after it. Prices are stored in a dated price table per model.

Permission Model

Every edit to the design document is a proposal with a diff.

Actor	Can propose edits	Approval
Viewer	No	n/a
Developer (has project access)	Yes	Can approve their own edits
Agent	Yes, within a grant	Must be pre-approved by a developer

An agent's pre-approval is a scoped grant that specifies:

which sections of the document it may edit
which actions it may take (document edits only, versus outside actions such as GitHub, email, or calendar)
a spending cap
an expiry date
who granted it

Rules:

An agent can never approve its own out-of-scope edit or another agent's edit.
Grants are checked on every action, not once at the start of a run.
Outside actions (GitHub, email, calendar) use stricter grants than document edits and show a preview first.
Pushing a document change across the workflow is a separate approval from editing the document.
The document stores a version number, and a change based on a stale version is rejected.
Every proposal, approval, and applied change is written to an audit log.
Tech Stack
Client: Expo (React Native) with file-based routing (Expo Router) and TypeScript
Auth and database: Supabase (Auth, Postgres with Row Level Security)
Server-side logic: Supabase Edge Functions (or equivalent) for agent actions, model calls, and cost accounting
Models: a default model (StepFun Step) plus user-selectable alternatives
Cloud: [describe your AWS / Creao usage here]
Getting Started
Prerequisites
Node.js (LTS)
npm
A Supabase project
API access for the model provider(s) you plan to use
Install and run
Install dependencies
bash
   npm install
Add your environment variables (see below)
Start the app
bash
   npx expo start

In the output, you can open the app in a:

development build
Android emulator
iOS simulator
Expo Go, a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the src/app directory. This project uses file-based routing.

Start from a clean slate
bash
npm run reset-project

This moves the starter code to the example directory and creates a blank src/app directory.

Linting and tests
ESLint: npx expo lint (guide)
Unit tests: Jest guide
Environment Variables

Create a .env file in the project root (and add it to .gitignore):

bash
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

Server-side secrets (model provider keys, Supabase service-role key, GitHub tokens) belong only in your server environment, such as Edge Function secrets. Never put them in the Expo app.

Project Structure
src/
  app/            # Screens and routes (Expo Router)
  components/     # Shared UI components      [planned]
  lib/            # Supabase client, cost utilities [planned]
supabase/
  functions/      # Edge Functions for agent and model calls [planned]
  migrations/     # Database schema and RLS policies [planned]

Update this section as the real structure settles.

Security Notes
Row Level Security policies in the database enforce who can read or edit each project.
Agent actions run server-side, never from the client.
Text from issues, emails, or documents is treated as untrusted, because it can contain prompt-injection instructions.
OAuth connections use least-privilege scopes.
Shared portfolio links are read-only and revocable. Users can hide anything that belongs to an employer.
Hackathon Tracks
StepUp pathway

[Explain how the project fits this pathway: the user it helps, the problem it solves, and how the default Step model is used. Add the specific judging criteria from the pathway here.]

Creao AWS contribution

[Describe what you are contributing to Creao on AWS: the component or integration, what it enables, and a link to the pull request or repository.]

Roadmap
MVP: auth, design document with proposals, cost meter, generated documentation
Model comparison: run the same task across models and compare quality and cost
Workflow actions: GitHub issues first, then email and calendar
Templates for company and internship teams
Shareable portfolio links
Team
Name	Role
[Name]	[Role]

Costs shown in the app are estimates. Check your model provider's current pricing for exact figures.