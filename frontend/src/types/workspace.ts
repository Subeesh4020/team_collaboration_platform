export type WorkspaceId = string;

export interface Workspace {
  id: WorkspaceId;
  name: string;
  slug: string;
  logoUrl?: string;
}
