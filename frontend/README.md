# Teamspace Web

The web client for a team collaboration platform: chat, meetings, files, documents, tasks, a wiki, universal search, integrations and permissions.

> **Status:** frontend only. There is no backend yet. Every API call goes to Mock Service Worker (MSW) handlers in `src/mocks`, built against the typed contracts in each feature's `types.ts`.
>
> - **Chat** is the reference vertical slice and works end to end.
> - **Universal search** works across all modules.
> - **Every other module** is a skeleton: a route, a page, types, permissions, an API client, mocks and a search provider, with no product logic yet.

## Setup

Requirements: Node 24+ and npm 11+. Git is needed for the hooks (run `git init` and then `npm install` once Git is available):

- `pre-commit` runs lint-staged (ESLint and Prettier on staged files), then the type check.
- `commit-msg` runs commitlint, which rejects messages that aren't Conventional Commits.

```bash
npm install
cp .env.example .env.local   # optional; defaults work for local dev
npm run dev
```

| Script                 | What it does                                                    |
| ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Starts the Vite dev server with mocked APIs                     |
| `npm run build`        | Type-checks, then builds for production into `dist/`            |
| `npm run preview`      | Serves the production build locally                             |
| `npm run lint`         | Runs ESLint, failing on any warning                             |
| `npm run format`       | Formats all files with Prettier                                 |
| `npm run format:check` | Checks formatting without writing                               |
| `npm run typecheck`    | Runs the TypeScript compiler in strict mode                     |
| `npm run test`         | Runs Vitest once (`test:watch` for watch mode)                  |
| `npm run ci`           | typecheck → lint → format:check → test → build (use this in CI) |

### Trying it out

- **Act as another role:** the user menu (top right) has a **Dev: act as role** section to switch between owner, admin, member and guest. Navigation, buttons and mock API responses all follow the role you pick.
- **Theme:** the same menu switches between light, dark and system.
- **Live updates:** in dev, a simulated colleague posts in `#general` or `#random` every 30 seconds, so you can watch real-time updates and unread badges.
- **Mock data resets** on every page reload. Only the dev role is kept across reloads.

### Tool versions

- **TypeScript 6.0.x**, not 7.x, because `typescript-eslint` does not support TypeScript 7 yet.
- **ESLint 9.x**, not 10.x, because `eslint-plugin-jsx-a11y` does not support ESLint 10 yet. npm prints a deprecation warning for ESLint 9; that is expected.

Upgrade both once those plugins add support.

## Folder rules

```
src/
  app/          App root, providers, routes, route registry, search registry, error boundary
  pages/        Route-level components. They compose features and hold no business logic
  features/     One folder per product module
    <feature>/
      components/   Used only by this feature (one folder per component)
      hooks/        Feature hooks (e.g. real-time subscriptions)
      api/          <feature>Keys.ts, <feature>Api.ts (requests), queries.ts (TanStack Query hooks)
      store/        Feature-local Zustand store, only if needed
      types.ts      Domain types and API contracts
      permissions.ts  Permission names the feature uses
      searchProvider.tsx  Universal search provider (if the feature is searchable)
      index.ts      Public API. Other code imports only from here
  components/
    ui/         Generic primitives (Button, Input, Modal, Dropdown, Tooltip, Avatar, EmptyState, ...)
    layout/     AppShell, Sidebar, Topbar, SplitPane, PageContainer
  hooks/        Shared hooks (e.g. useTheme)
  lib/
    api/          Fetch client, ApiError normalization, bearer token
    realtime/     Typed WebSocket client, reconnect, subscriptions, React hooks
    rtc/          Call and screen-share interfaces (no implementation yet)
    permissions/  Roles, can(), <Can>, usePermission()
    search/       Search provider contract and registry
    utils/        Dates, ids
  config/       env.ts (the only reader of import.meta.env), paths, feature flags
  types/        Shared domain types (User, Workspace, Role, Attachment, ActionItem)
  styles/       tokens.css, reset.css, global.css
  mocks/        MSW handlers and fixtures, grouped by feature
  test/         Test setup and renderApp()
```

**Dependency direction: `pages → features → components / lib`.** ESLint (`eslint-plugin-boundaries`) enforces this:

| From         | May import                                                                           |
| ------------ | ------------------------------------------------------------------------------------ |
| `app`        | pages, features, components, hooks, lib, config, types, assets                       |
| `pages`      | features, components, hooks, lib, config, types, assets                              |
| `features/x` | its own files, other features **only via `index.ts`**, ui, hooks, lib, config, types |
| `layout`     | ui, hooks, lib, config, types                                                        |
| `ui`         | ui, lib, config, types                                                               |
| `hooks`      | lib, config, types                                                                   |
| `lib`        | lib, config, types                                                                   |
| `config`     | types                                                                                |
| `mocks`      | lib, config, types, features via `index.ts`                                          |

- `import-x/no-cycle` blocks circular imports.
- Test files (`*.test.ts[x]`) may also import `src/test` and `src/mocks`.
- Co-locate code by default. Move it to a shared folder only when a second feature needs it.
- Every page is lazy-loaded at route level, so heavy modules (documents editor, meetings, Kanban) get their own chunks.
- Don't create empty folders. Add `store/`, `hooks/` and so on only when a feature needs them.

### How features connect

- **Search:** each feature exports a search provider. `app/searchRegistry.ts` registers it, and `features/search` reads providers only from the registry.
- **Meetings → tasks:** meeting notes hold `ActionItem`s (a shared type in `types/`). Meetings will turn them into tasks by calling `createTaskFromActionItem` from `@/features/tasks`.
- **Attachments:** files and tasks attach to messages through the shared `Attachment` type. `fileToAttachment` from `@/features/files` builds one from a file.
- **Real-time:** features subscribe to typed events in their own hooks (for example `useChannelMessagesSubscription`). Components never open WebSockets themselves.
- **Shared data:** chat reads author names from `@/features/members`, through its public API.

## Naming conventions

- **Components:** one folder per component, in `PascalCase`. Keep non-component helpers in a separate file so Fast Refresh keeps working:
  ```
  MessageItem/
    MessageItem.tsx
    MessageItem.module.css
    MessageItem.test.tsx
    index.ts            // export { MessageItem } from './MessageItem';
  ```
- **Props:** an interface named `<Component>Props`.
- **Exports:** named exports only, pages included. Routes lazy-load the named export.
- **Hooks:** `useSomething.ts`, in camelCase.
- **CSS Modules:** the file name matches the component, classes are camelCase, and the import is named `styles`.
- **Query keys:** one factory per feature, for example `chatKeys.messages(channelId)`.
- **Permissions:** `<resource>:<action>`, for example `files:edit` or `wiki:publish`.
- **Commits and PR titles:** [Conventional Commits](https://www.conventionalcommits.org), for example `feat(chat): add reactions` or `fix(files): handle empty upload`. Enforced by commitlint (`commitlint.config.js`).

## Styling rules

- Every color, spacing, font size, radius, shadow, z-index and size comes from `src/styles/tokens.css`. No hardcoded values.
- Themes are set with `data-theme="light" | "dark"` on `<html>`. Dark mode only overrides semantic tokens. Components never use `--palette-*` directly.
- Mobile-first, using `min-width` media queries at breakpoints 640 / 768 / 1024 / 1280px.
- No `!important`, no deep nesting, no Tailwind, no CSS-in-JS, no UI libraries.

## How to add a feature

Use `src/features/files` as a small template, or `src/features/chat` as the full reference.

1. Create `src/features/<name>/`:
   - `types.ts`: domain types and API contracts. Declare real-time events here by extending `RealtimeEvents` in `@/lib/realtime`.
   - `permissions.ts`: `export const <name>Permissions = { ... } as const satisfies Record<string, Permission>`.
   - `api/<name>Keys.ts`, `api/<name>Api.ts` and `api/queries.ts`.
   - `components/`: components used only by this feature.
   - `index.ts`: the public API. Export only what other code needs.
2. Add mocks:
   - `src/mocks/fixtures/<name>.ts` for fixtures.
   - `src/mocks/handlers/<name>.ts` for handlers. `searchableResource()` gives you list and search endpoints that enforce permissions.
   - Register the handlers in `src/mocks/handlers/index.ts`.
3. Add a page in `src/pages/<Name>Page/` that only composes the feature's components.
4. Add the route to `src/app/routeRegistry.ts` with its path, label, icon, permission, feature flag and a `load` function. The route is lazy-loaded and gated automatically, and it appears in the navigation for users who have the permission.
5. Add the path to `src/config/paths.ts` and, if needed, a flag to `src/config/featureFlags.ts`.
6. If the feature is searchable, add a search provider (see the next section).

## How to add a search provider

Create `searchProvider.tsx` in the feature and export it from `index.ts`:

```tsx
export const filesSearchProvider: SearchProvider<FileItem> = {
  type: 'files', // unique key
  label: 'Files', // group heading
  permission: filesPermissions.view, // users without it don't query this provider
  search: (query, { signal, limit }) => searchFiles(query, limit, signal),
  renderResult: (file) => <ResultRow icon="file" title={file.name} />,
  getKey: (file) => file.id,
  getHref: () => paths.files(),
};
```

Then add it to the `providers` array in `src/app/searchRegistry.ts`, in the order the groups should appear. `features/search` must never import another feature. It only sees the registry.

## How to add a permission

1. Add the name to `PERMISSIONS` in `src/lib/permissions/permissions.ts`.
2. Give roles access in `ROLE_PERMISSIONS` (`src/lib/permissions/roles.ts`), with a scope:
   - `any`: every resource.
   - `member`: public resources, plus private ones the user belongs to.
   - `invited`: only resources the user was added to. Guests use this.
   - `own`: only resources the user owns.
3. Add it to the feature's `permissions.ts` map.
4. Gate the UI:
   ```tsx
   <Can permission={filesPermissions.edit} resource={fileResource(file)}>
     <Button>Edit</Button>
   </Can>;
   const canEdit = usePermission('files:edit', fileResource(file));
   const can = useCan(); // can(permission, resource?)
   ```
   For routes, set `permission` on the route in `routeRegistry.ts`.
5. Enforce it in the mock handler too, with `checkPermission`, the way the real backend will.

> UI gating only makes the app easier to use. **The server must enforce every permission.**

## Libraries for later modules (approved and installed)

Approved and installed on 2026-11-19. Nothing imports them yet, so they add nothing to the production bundle until their modules are built.

- **Documents:** `@tiptap/react`, `@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-collaboration`, `@tiptap/y-tiptap`, `yjs`
- **Meetings:** `livekit-client`. Wrap it in an adapter that implements `RtcClient` from `lib/rtc`, and don't import it in feature code.
- **Tasks:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Long lists:** `@tanstack/react-virtual`

Load the Documents, Meetings and Tasks libraries only from their lazy-loaded modules.

| Module                 | Library                                      | Why                                                                                                                                              |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Documents (co-editing) | Tiptap (ProseMirror) + Yjs                   | Ships without built-in styling, so it fits CSS Modules. The most mature real-time collaboration option. Yjs snapshots provide version history.   |
| Meetings (video calls) | LiveKit (`livekit-client`), behind `lib/rtc` | Group calls need a media server (SFU). LiveKit can be self-hosted, records on the server, and can be swapped out behind the `lib/rtc` interface. |
| Tasks (Kanban)         | dnd-kit (`@dnd-kit/core` + `sortable`)       | Keyboard dragging and screen-reader announcements built in, no built-in styling.                                                                 |
| Long lists             | `@tanstack/react-virtual`                    | The message list and search results already render from flat row arrays, so adding it is a local change.                                         |
