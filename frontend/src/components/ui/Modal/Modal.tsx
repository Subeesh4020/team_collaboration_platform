import { useEffect, useId, useRef, type ReactNode } from 'react';

import { IconButton } from '../IconButton';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Footer actions, e.g. Cancel / Save buttons. */
  footer?: ReactNode;
}

/**
 * Modal dialog built on native <dialog>.showModal(), which provides the focus
 * trap, Escape to close, inert background and top-layer stacking for free.
 * Focus returns to the previously focused element on close.
 */
export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const previouslyFocused = document.activeElement;
      dialog.showModal();
      return () => {
        if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
      };
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      {open && (
        <div className={styles.panel}>
          <header className={styles.header}>
            <div>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className={styles.description}>
                  {description}
                </p>
              )}
            </div>
            <IconButton icon="close" label="Close dialog" size="sm" onClick={onClose} />
          </header>
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
