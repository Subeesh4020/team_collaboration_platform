import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, type DropdownItem } from '@/components/ui/Dropdown';
import { Icon } from '@/components/ui/Icon';
import { env } from '@/config/env';
import { useTheme } from '@/hooks/useTheme';
import { ROLES } from '@/types';

import { useCurrentUser, useSwitchDevRoleMutation } from '../../api/queries';
import styles from './UserMenu.module.css';

export function UserMenu() {
  const user = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const switchRole = useSwitchDevRoleMutation();

  const items: DropdownItem[] = [
    { type: 'heading', id: 'theme-heading', label: 'Theme' },
    {
      id: 'theme-light',
      label: 'Light',
      checked: theme === 'light',
      onSelect: () => {
        setTheme('light');
      },
    },
    {
      id: 'theme-dark',
      label: 'Dark',
      checked: theme === 'dark',
      onSelect: () => {
        setTheme('dark');
      },
    },
    {
      id: 'theme-system',
      label: 'System',
      checked: theme === 'system',
      onSelect: () => {
        setTheme('system');
      },
    },
  ];

  if (env.isDev || env.enableMocks) {
    items.push(
      { type: 'separator', id: 'dev-separator' },
      { type: 'heading', id: 'role-heading', label: 'Dev: act as role' },
      ...ROLES.map((role) => ({
        id: `role-${role}`,
        label: role.charAt(0).toUpperCase() + role.slice(1),
        checked: user.role === role,
        disabled: switchRole.isPending,
        onSelect: () => {
          switchRole.mutate(role);
        },
      })),
    );
  }

  return (
    <Dropdown
      label="User menu"
      align="end"
      items={items}
      trigger={(props) => (
        <button
          {...props}
          type="button"
          className={styles.trigger}
          aria-label={`User menu for ${user.name}`}
        >
          <Avatar name={user.name} src={user.avatarUrl} size="sm" decorative />
          <span className={styles.meta}>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.role}>{user.role}</span>
          </span>
          <Icon name="chevronDown" size="sm" />
        </button>
      )}
    />
  );
}
