import { useId, type InputHTMLAttributes, type Ref } from 'react';

import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  /** Visually hide the label (it stays available to screen readers). */
  hideLabel?: boolean;
  hint?: string;
  error?: string | undefined;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  label,
  hideLabel = false,
  hint,
  error,
  className,
  ref,
  ...rest
}: InputProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={hideLabel ? styles.hiddenLabel : styles.label}>
        {label}
      </label>
      <input
        {...rest}
        ref={ref}
        id={id}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
