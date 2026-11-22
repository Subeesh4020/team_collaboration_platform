import type { PresenceStatus } from '@/types';

import styles from './Avatar.module.css';
import { getInitials } from './getInitials';

export interface AvatarProps {
  name: string;
  src?: string | undefined;
  size?: 'sm' | 'md' | 'lg';
  presence?: PresenceStatus | undefined;
  /** Hide from assistive tech when the name is already shown next to it. */
  decorative?: boolean;
}

export function Avatar({ name, src, size = 'md', presence, decorative = false }: AvatarProps) {
  const label = presence ? `${name} (${presence})` : name;
  return (
    <span
      className={`${styles.root} ${styles[size]}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      {src ? (
        <img className={styles.image} src={src} alt="" />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
      {presence && <span className={`${styles.presence} ${styles[presence]}`} aria-hidden="true" />}
    </span>
  );
}
