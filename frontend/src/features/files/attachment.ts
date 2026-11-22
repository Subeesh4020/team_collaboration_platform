import type { Attachment } from '@/types';

import type { FileItem } from './types';

/** Converts a file into the shared Attachment shape (e.g. to attach it to a message). */
export function fileToAttachment(file: FileItem): Attachment {
  return {
    id: `att_${file.id}`,
    kind: 'file',
    refId: file.id,
    title: file.name,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
  };
}
