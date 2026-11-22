import { useId, type InputHTMLAttributes } from 'react';

import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label: string;
  hint?: string;
}

export function Checkbox({ label, hint, className, ...rest }: CheckboxProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <input {...rest} id={id} type="checkbox" className={styles.input} aria-describedby={hintId} />
      <div className={styles.text}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
