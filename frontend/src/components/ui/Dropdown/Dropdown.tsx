import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';

import { Icon, type IconName } from '../Icon';
import styles from './Dropdown.module.css';

export interface DropdownActionItem {
  type?: 'item';
  id: string;
  label: string;
  icon?: IconName;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
  /** When set, the item behaves as a radio option (`menuitemradio`). */
  checked?: boolean;
}

export interface DropdownSeparator {
  type: 'separator';
  id: string;
}

export interface DropdownHeading {
  type: 'heading';
  id: string;
  label: string;
}

export type DropdownItem = DropdownActionItem | DropdownSeparator | DropdownHeading;

export interface DropdownTriggerProps {
  ref: Ref<HTMLButtonElement>;
  id: string;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

export interface DropdownProps {
  /** Accessible name of the menu. */
  label: string;
  items: readonly DropdownItem[];
  /** Renders the trigger button. Spread the given props onto a <button>. */
  trigger: (props: DropdownTriggerProps) => ReactNode;
  align?: 'start' | 'end';
  /** Opens the menu upwards (e.g. for triggers at the bottom of the screen). */
  side?: 'bottom' | 'top';
}

function isAction(item: DropdownItem): item is DropdownActionItem {
  return item.type === undefined || item.type === 'item';
}

/** Accessible menu button following the WAI-ARIA menu pattern. */
export function Dropdown({
  label,
  items,
  trigger,
  align = 'start',
  side = 'bottom',
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const triggerId = useId();
  const menuId = useId();

  const actions = items.filter(isAction);
  const enabledIndexes = actions.flatMap((item, index) => (item.disabled ? [] : [index]));
  const actionIndexById = new Map(actions.map((item, index) => [item.id, index]));

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    setActiveIndex(-1);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const openAt = (position: 'first' | 'last') => {
    setOpen(true);
    const index = position === 'first' ? enabledIndexes[0] : enabledIndexes.at(-1);
    setActiveIndex(index ?? -1);
  };

  useEffect(() => {
    if (open && activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) close(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  const move = (direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return;
    const current = enabledIndexes.indexOf(activeIndex);
    const next = (current + direction + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[next] ?? -1);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAt('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openAt('last');
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(enabledIndexes[0] ?? -1);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(enabledIndexes.at(-1) ?? -1);
        break;
      case 'Escape':
        event.preventDefault();
        close(true);
        break;
      case 'Tab':
        close(false);
        break;
    }
  };

  const select = (item: DropdownActionItem) => {
    if (item.disabled) return;
    close(true);
    item.onSelect();
  };

  return (
    <div ref={rootRef} className={styles.root}>
      {trigger({
        ref: triggerRef,
        id: triggerId,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': menuId,
        onClick: () => {
          if (open) close(false);
          else openAt('first');
        },
        onKeyDown: onTriggerKeyDown,
      })}
      <div
        id={menuId}
        role="menu"
        aria-label={label}
        className={[styles.menu, styles[align], styles[side]].join(' ')}
        tabIndex={-1}
        hidden={!open}
        onKeyDown={onMenuKeyDown}
      >
        {/* Items mount only while open, keeping long lists of menus (e.g. per message) light. */}
        {open &&
          items.map((item) => {
            if (item.type === 'separator') {
              return <div key={item.id} role="separator" className={styles.separator} />;
            }
            if (item.type === 'heading') {
              return (
                <div key={item.id} role="presentation" className={styles.heading}>
                  {item.label}
                </div>
              );
            }
            const index = actionIndexById.get(item.id) ?? -1;
            const isRadio = item.checked !== undefined;
            return (
              <button
                key={item.id}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                role={isRadio ? 'menuitemradio' : 'menuitem'}
                aria-checked={isRadio ? item.checked : undefined}
                aria-disabled={item.disabled ? true : undefined}
                tabIndex={index === activeIndex ? 0 : -1}
                className={[styles.item, item.danger && styles.danger].filter(Boolean).join(' ')}
                onClick={() => {
                  select(item);
                }}
                onMouseEnter={() => {
                  if (!item.disabled) setActiveIndex(index);
                }}
              >
                <span className={styles.itemIcon}>
                  {isRadio
                    ? item.checked && <Icon name="check" size="sm" />
                    : item.icon && <Icon name={item.icon} size="sm" />}
                </span>
                {item.label}
              </button>
            );
          })}
      </div>
    </div>
  );
}
