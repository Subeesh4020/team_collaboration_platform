/**
 * Inline SVG path data (24×24 viewBox, stroke-based). Add icons here; keep
 * them generic. No icon library is used.
 */
export const iconPaths = {
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z',
  video: 'M3 7h12v10H3zM15 10l6-3v10l-6-3',
  file: 'M14 3H6v18h12V7zM14 3v4h4',
  document: 'M14 3H6v18h12V7zM14 3v4h4M9 12h6M9 16h6',
  tasks: 'M4 4h16v16H4zM8 12l3 3 5-6',
  book: 'M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2zM4 19V5',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM21 21l-5-5',
  plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4',
  users:
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7M18 14a6 6 0 0 1 4 7',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.4-.9-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-.9a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z',
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'M6 6l12 12M18 6 6 18',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z',
  plus: 'M12 5v14M5 12h14',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  hash: 'M4 9h16M4 15h16M10 3 8 21M16 3l-2 18',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 1 1 8 0v4',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  chevronDown: 'm6 9 6 6 6-6',
  check: 'm5 12 5 5 9-11',
  trash: 'M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15',
  edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  alert: 'M12 3 2 21h20zM12 10v5M12 18h.01',
  home: 'M3 11 12 3l9 8M5 9v12h14V9',
  logout: 'M9 21H4V3h5M16 17l5-5-5-5M21 12H9',
} as const;

export type IconName = keyof typeof iconPaths;
