import { useEffect, useId, useState, type ReactNode } from 'react';

import styles from './Tooltip.module.css';

export interface TooltipTriggerProps {
  'aria-describedby': string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export interface TooltipProps {
  content: ReactNode;
  /** Render the trigger element and spread the given props onto it. */
  children: (props: TooltipTriggerProps) => ReactNode;
  placement?: 'top' | 'bottom';
  /** Hover delay in ms. Focus shows immediately. */
  delay?: number;
}

/**
 * Supplementary description for a focusable element. Not for essential
 * information: tooltips are invisible on touch devices.
 */
export function Tooltip({ content, children, placement = 'top', delay = 400 }: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const [hoverReady, setHoverReady] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const id = useId();

  const open = (focused || hoverReady) && !dismissed;

  useEffect(() => {
    if (!hovered) return;
    const timer = setTimeout(() => {
      setHoverReady(true);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [hovered, delay]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setDismissed(true);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <span className={styles.root}>
      {children({
        'aria-describedby': id,
        onMouseEnter: () => {
          setDismissed(false);
          setHovered(true);
        },
        onMouseLeave: () => {
          setHovered(false);
          setHoverReady(false);
        },
        onFocus: () => {
          setDismissed(false);
          setFocused(true);
        },
        onBlur: () => {
          setFocused(false);
        },
      })}
      <span
        id={id}
        role="tooltip"
        className={`${styles.tooltip} ${styles[placement]}`}
        data-open={open || undefined}
      >
        {content}
      </span>
    </span>
  );
}
