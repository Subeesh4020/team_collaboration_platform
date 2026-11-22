/**
 * A reference to an entity from another module, attached to something else
 * (e.g. a file or task attached to a chat message, or a meeting action item
 * turned into a task). Features connect through this shape, never through
 * each other's internals.
 */
export type AttachmentKind = 'file' | 'task' | 'document' | 'wiki-page' | 'meeting';

export interface Attachment {
  id: string;
  kind: AttachmentKind;
  /** Id of the referenced entity in its own module. */
  refId: string;
  title: string;
  /** Optional app-relative URL to open the referenced entity. */
  href?: string;
  /** For files: MIME type and size in bytes. */
  mimeType?: string;
  sizeBytes?: number;
}
