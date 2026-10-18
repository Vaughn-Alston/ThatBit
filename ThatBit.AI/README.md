# ThatBit

ThatBit is a collaboration workspace for computer science students to keep project information, documentation, and accountability in one place.

## App Preview

<!-- Add your screenshot to assets/images/thatbit-preview.png, then remove this comment. -->

![ThatBit app preview](./assets/images/thatbit-preview.png)

## What This Project Is

Project work often gets scattered across messages, meetings, calendars, repositories, and personal notes. ThatBit is designed as one calm place where a team can bring that context together and preserve the story of how a project was built.

## Current Experience

The current prototype includes:

- A minimal, dark interface that works across Expo-supported platforms, including the web.
- Sign-in and sign-up screens with responsive form layouts.
- A clearly labeled demo-mode bypass for testing without an account or Supabase.
- A project context map rooted at a Start design-document node.
- Markdown documents that create irregular document branches and connected checklist tasks.
- Node detail modals with a name, short description, creation date, and the Markdown source used to create the node.
- Local task completion and node selection for exploring the graph.

## Architecture

ThatBit is an Expo application built with React Native, TypeScript, and Expo Router.

- `src/app/` contains file-based routes.
- `src/components/` contains shared interface components.
- `src/hooks/` contains reusable platform and theme hooks.
- `src/constants/` contains shared theme values.
- `assets/` contains icons and images used by the app.
- [MVP-DESIGN.md](./MVP-DESIGN.md) records the node data model and detail-view behavior.

The project is configured to run on the web, iOS, and Android. The demo workspace keeps its nodes in memory for the current session; no backend or AI service is connected.

## Product / Design Decisions

- The interface is intentionally minimal and web-style. **[stated by builder]**
- The product is intended to help computer science students organize projects, maintain documentation, and support accountability. **[stated by builder]**
- The long-term product direction is to bring project information together and leave it in one place as the project’s story. **[stated by builder]**

## Known Limitations

- Sign-in and account creation are interface-only; use **Continue in demo mode** to reach the workspace without Supabase.
- Workspace nodes and task completion are local to the current session and are lost when the app reloads.
- Node creation dates and Markdown source are shown in the detail view but are not persisted beyond the current session.
- Markdown is entered or pasted into the in-app editor; importing a `.md` file is not implemented.
- The map illustrates the intended shared AI context; no LLM is connected yet.
- Photos, Gmail, Calendar, Meet, and GitHub appear as visual examples only. They are not live integrations.
- Ollama is an intended integration but has not been implemented in the current repository.
- Handling unusually large amounts of user data remains an open product and architecture concern.
- No automated tests currently exist.

## Credits

- Built with [Expo](https://expo.dev/), [React Native](https://reactnative.dev/), and [Expo Router](https://docs.expo.dev/router/introduction/).
- The repository includes `@supabase/supabase-js`, but Supabase is not connected in the current app flow.
- Intended local AI integration: [Ollama](https://ollama.com/) (not started).
- Starter assets originate from the Expo project template. Replace or attribute any additional third-party assets before submission.

## Roadmap

- Connect account creation and sign-in to a real authentication backend.
- Persist project maps and connect a defined AI-assisted workflow.
- Add project activity and accountability features.
- Design safe limits and storage behavior for large projects.
- Connect Ollama for a clearly defined AI-assisted workflow.
- Evaluate and implement external tool integrations individually.

## Development History

### 2026-10-18 08:39 — Authentication MVP design

What changed: Added the sign-in and sign-up screens, navigation between them, a dark visual system, and a reflected row of service icons.

Why: The builder wanted a relevant visual design for the MVP and liked the river-like reflection effect. **[stated by builder]**

Notes worth remembering: The builder identified a glossier finish as future polish. The commit mentions Supabase as the intended destination for form data, but the current implementation does not connect or save to Supabase.

### 2026-10-18 08:42 — Authentication interface verified

What changed: Documented the existing sign-in and sign-up prototype, its navigation, and the current integration boundaries.

Why: Create an honest, presentation-ready project record without presenting planned integrations as complete.

Notes worth remembering: Authentication and all displayed external services remain unconnected.

## Running the Project

Requirements:

- Node.js and npm

From the `ThatBit.AI` directory:

```bash
npm install
npm run web
```

Other available development commands:

```bash
npm start        # Open the Expo development server
npm run ios      # Open the iOS target
npm run android  # Open the Android target
npm run lint     # Run Expo linting
npx tsc --noEmit # Run the TypeScript type check
```

No environment variables are currently used by the implemented app flow.
