import type { ButtonHTMLAttributes } from 'react';

import { Icon, type IconName } from '../Icon';
import styles from './IconButton.module.css';

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'aria-label'
> {
  icon: IconName;
  /** Required accessible name, since the button has no visible text. */
  label: string;
  size?: 'sm' | 'md';
  variant?: 'ghost' | 'onDark';
}

export function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  type = 'button',
  className,
  ...rest
}: IconButtonProps) {
  const classes = [styles.button, styles[size], styles[variant], className]
    .filter(Boolean)
    .join(' ');
  return (
    <button {...rest} type={type} className={classes} aria-label={label} title={label}>
      <Icon name={icon} size={size === 'sm' ? 'sm' : 'md'} />
    </button>
  );
}
