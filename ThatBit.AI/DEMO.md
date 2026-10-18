# ThatBit Demo Guide

## One-line pitch

ThatBit is a collaboration workspace designed to help computer science students keep project context, documentation, and accountability in one place.

## 30-second pitch

Student projects quickly become scattered across repositories, meetings, calendars, messages, and notes. ThatBit is designed to bring that project context into one calm workspace so the team can stay organized and preserve the story of how the work came together. The prototype includes a local demo path and a Markdown-driven context map; authentication, persistence, Ollama support, and external integrations remain future work.

## Problem → Solution → Who It Helps

- **Problem:** Computer science project information and documentation become scattered, making organization and accountability harder.
- **Solution:** One workspace intended to hold the project’s information and evolving story.
- **Who it helps:** Computer science students working on projects.

## Two-minute demo script

1. From the `ThatBit.AI` directory, run `npm run web` and open the local URL shown by Expo.
2. Show the sign-in screen and explain that authentication is intentionally bypassed for this local prototype.
3. Select **Continue in demo mode**; no credentials are required and no request is made to Supabase.
4. Point out the central **Start / Design doc** node and explain that the map is empty until the user adds context.
5. Select **Add a branch**, enter a Markdown heading and checklist, then choose **Parse & add to map**.
6. Show how the document and its tasks appear as connected nodes in an irregular branch; select a task and mark it complete.
7. Explain that the map represents the shared context intended for an AI assistant, but the nodes are local-only and no LLM is connected.

## Demo risks and fallbacks

| Risk | Dependency | Fallback |
| --- | --- | --- |
| Expo development server does not start | Local Node/npm setup | Record a short backup video of both screens before presenting |
| Browser target fails to load | Local development environment | Use Expo Go on a prepared device or show current screenshots |
| A judge expects authentication to create an account | The demo-mode path skips auth | State clearly that this bypass is only for testing; no account is created |
| The graph is mistaken for a live AI integration | AI and persistence are not connected | Explain that the map demonstrates the intended context structure only |
| A judge expects Markdown file upload | The composer accepts pasted or typed Markdown | Explain that file import is a future addition |

## What is real vs. simulated

| Capability | Reality |
| --- | --- |
| Sign-in and sign-up interface | Real, working local UI |
| Navigation between authentication screens | Real, local Expo Router navigation |
| Demo-mode authentication bypass | Real local navigation; no auth request or account |
| Markdown-to-node parsing | Real local parsing of headings and checklist items |
| Node graph and task completion | Real local UI; state is not persisted |
| Supabase authentication | Not started |
| Photos, Gmail, Calendar, Meet, and GitHub | Decorative product-direction examples; not connected |
| Ollama | Intended integration; not started |
| AI connection and durable project workspace | Vision; not implemented |

## Likely judge questions

**Why this problem?**  
The builder identified project organization, proper documentation, and accountability as recurring needs for computer science students.

**Why this approach?**  
The intended experience brings project information together and leaves it in one place as the project’s story. The minimal, web-style direction was stated by the builder.

**What was technically hard?**  
[BUILDER TO FILL IN]

**What happens with bad input or a failed service?**  
The current prototype does not submit data to a service. A production flow still needs validation, error handling, retry behavior, and clear offline or failure states.

**How do you handle privacy and safety?**  
No privacy or security guarantees have been implemented. A production version would need explicit data-access rules, secure authentication, retention controls, and careful handling of connected-service permissions.

**How would it scale?**  
This has not been designed yet. Large projects and excessive user data are a known concern that requires storage limits, pagination, indexing, and retention decisions.

**How would it make money?**  
[BUILDER TO FILL IN]

**What comes next?**  
Persist project maps, connect authentication, define the AI workflow, and then add external integrations one at a time.

## If we had more time

- Build the project workspace and documentation workflow.
- Add accountability and project activity features.
- Connect real authentication.
- Define and implement an Ollama-assisted workflow.
- Add storage limits and graceful handling for large projects.
- Evaluate external tool integrations based on the core workflow.

## Devpost-style writeup draft

### Inspiration

Computer science students often have project information spread across different tools. ThatBit was inspired by the idea of bringing that work into one place and preserving it as the project’s story.

### What it does

ThatBit is designed as a collaboration workspace for project organization, documentation, and accountability. The prototype includes a local demo path and a Markdown-driven node map; authentication, persistence, and integrations remain unconnected.

### How we built it

The prototype uses Expo, React Native, TypeScript, and Expo Router. The workspace parses Markdown headings and checklist items into an in-memory node graph, with a local demo path that does not call Supabase.

### Challenges

[BUILDER TO FILL IN]

### Accomplishments

The repository contains responsive authentication screens, an explicit local testing bypass, and an interactive Markdown-to-node workspace.

### What we learned

[BUILDER TO FILL IN]

### What’s next

The next milestones are durable project storage, real authentication, an explicitly defined AI workflow, and careful handling of large project datasets.

### Solo-builder note

[BUILDER TO FILL IN: confirm which parts you built end to end.]
