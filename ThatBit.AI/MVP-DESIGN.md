# ThatBit MVP Design: Context Nodes

## Goal

Let a project member revisit a point in the project map and understand what it was called, what it means, when it was added, and which information created it.

## Node data

Every map node has:

| Field | Meaning |
| --- | --- |
| `title` | The node's display name. |
| `description` | A short summary shown in the node detail view and workspace footer. |
| `createdAt` | An ISO timestamp recording when the node was added. |
| `source` | The information used to create the node. For Markdown documents and checklist tasks, this is the original Markdown input. |

Nodes also retain their graph-specific fields, including their identifier, type, parent, and map position. Task nodes additionally retain their completion status.

## Creating nodes from Markdown

- A Markdown heading supplies the document title.
- The first prose paragraph, excluding headings and checklist items, supplies the short description.
- Checklist items create child task nodes. Their description identifies the parent document.
- The full Markdown input is retained as the source on the document and its generated tasks.
- Nodes created from the same Markdown submission share a creation timestamp.
- If a document has no prose paragraph, it receives the fallback description “No short description was included.”

## Viewing node details

Selecting any node opens a compact modal showing its name, type, short description, creation date, and creation source. Task details also show whether the task is open or complete. Closing the modal leaves the selected node available as the parent for a new branch.

## MVP boundaries

- Node data is held in local in-memory state and is cleared when the app reloads.
- Creation dates use the device's local date formatting when displayed.
- The source is displayed as plain text; Markdown rendering and editing existing nodes are out of scope.
- Durable storage, shared workspaces, and AI-generated descriptions are not included in this MVP.
