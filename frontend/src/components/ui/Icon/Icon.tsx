import styles from './Icon.module.css';
import { iconPaths, type IconName } from './icons';

export interface IconProps {
  name: IconName;
  size?: 'sm' | 'md';
  /** Accessible label. Omit for decorative icons (hidden from screen readers). */
  label?: string;
  className?: string | undefined;
}

export function Icon({ name, size = 'md', label, className }: IconProps) {
  const classes = [styles.icon, styles[size], className].filter(Boolean).join(' ');
  return (
    <svg
      className={classes}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
