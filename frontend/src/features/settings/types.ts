/** Personal preferences (persisted server-side once the backend exists). */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  desktopNotifications: boolean;
}
