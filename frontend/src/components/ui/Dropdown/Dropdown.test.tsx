import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Dropdown, type DropdownItem } from './Dropdown';

function setup(items?: DropdownItem[]) {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const user = userEvent.setup();
  render(
    <Dropdown
      label="Actions"
      items={
        items ?? [
          { id: 'edit', label: 'Edit', onSelect: onEdit },
          { id: 'archive', label: 'Archive', onSelect: vi.fn(), disabled: true },
          { type: 'separator', id: 'sep' },
          { id: 'delete', label: 'Delete', onSelect: onDelete, danger: true },
        ]
      }
      trigger={(props) => (
        <button {...props} type="button">
          More
        </button>
      )}
    />,
  );
  return { user, onEdit, onDelete, trigger: screen.getByRole('button', { name: 'More' }) };
}

describe('<Dropdown>', () => {
  it('opens on click and focuses the first item', async () => {
    const { user, trigger } = setup();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu', { name: 'Actions' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });

  it('skips disabled items with arrow keys and wraps around', async () => {
    const { user, trigger } = setup();
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });

  it('selects with Enter, closes and restores focus to the trigger', async () => {
    const { user, trigger, onDelete } = setup();
    trigger.focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(onDelete).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape', async () => {
    const { user, trigger } = setup();
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('exposes radio items with aria-checked', async () => {
    const { user, trigger } = setup([
      { id: 'light', label: 'Light', checked: true, onSelect: vi.fn() },
      { id: 'dark', label: 'Dark', checked: false, onSelect: vi.fn() },
    ]);
    await user.click(trigger);
    expect(screen.getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});
