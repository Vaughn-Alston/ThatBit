# ThatBit Status

Last repository verification: 2026-10-18 10:29 PDT

| Name | Status | Integration state | Evidence | Last verified (HH:MM) | Who said so |
| --- | --- | --- | --- | --- | --- |
| Sign-in interface | DONE | MOCKED | `src/app/index.tsx` routes to `AuthScreen`; form renders and submit shows an unconnected notice | 10:29 | repo-verified |
| Sign-up interface | DONE | MOCKED | `src/app/sign-up.tsx` routes to sign-up mode; form renders and submit shows an unconnected notice | 10:29 | repo-verified |
| Demo-mode workspace bypass | DONE | MOCKED | `AuthScreen` routes to `/workspace` without sending credentials or making a Supabase request | 10:29 | repo-verified |
| Sign-in/sign-up navigation | DONE | MOCKED | Expo Router links switch between `/` and `/sign-up` | 10:29 | repo-verified |
| Responsive minimal dark design | DONE | NOT STARTED | Shared React Native styles and responsive width constraints exist in `AuthScreen` | 10:29 | both |
| Supabase authentication | PLANNED | NOT STARTED | Package and ignored local variable names exist, but there is no client configuration or authentication call | 10:29 | repo-verified |
| Photos integration | VISION | NOT STARTED | Name and decorative icon only; no service call exists | 10:29 | repo-verified |
| Gmail integration | VISION | NOT STARTED | Name and decorative icon only; no service call exists | 10:29 | repo-verified |
| Calendar integration | VISION | NOT STARTED | Name and decorative icon only; no service call exists | 10:29 | repo-verified |
| Meet integration | VISION | NOT STARTED | Name and decorative icon only; no service call exists | 10:29 | repo-verified |
| GitHub integration | VISION | NOT STARTED | Name and decorative icon only; no service call exists | 10:29 | repo-verified |
| Node workspace | DONE | MOCKED | `/workspace` renders an in-memory graph with a Start design-document root and user-created branches | 10:29 | repo-verified |
| Markdown-to-task workflow | DONE | MOCKED | Markdown headings create document nodes and checklist items create connected tasks in memory | 10:29 | repo-verified |
| Project documentation workflow | PARTIALLY DONE | MOCKED | Pasted Markdown creates local nodes; file import and persistence are not implemented | 10:29 | repo-verified |
| Design-document task view | DONE | MOCKED | Tasks are parsed locally from bundled `docs/docs/design-doc.md` and completion is session-only | 10:29 | repo-verified |
| PDF node attachments | DONE | MOCKED | Web drop/picker and native picker attach local file references; there is no upload or durable storage | 10:29 | repo-verified |
| Accountability workflow | VISION | NOT STARTED | Described by builder; no persistent activity or accountability implementation exists | 10:29 | both |
| Ollama integration | PLANNED | NOT STARTED | Named as intended integration; no Ollama code or configuration exists | 10:29 | both |
| Large-data handling | PLANNED | NOT STARTED | Builder identified excessive user data as a concern; no limits or storage design exists | 10:29 | both |
| Physical frontend/backend folder split | PLANNED | NOT STARTED | Frontend ownership is documented; no backend exists, and the move is deferred during the final demo freeze | 10:29 | both |
