import styles from './Spinner.module.css';

export interface SpinnerProps {
  /** Announced to screen readers. */
  label?: string;
}

export function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <span className={styles.root} role="status">
      <span className={styles.circle} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </span>
  );
}
