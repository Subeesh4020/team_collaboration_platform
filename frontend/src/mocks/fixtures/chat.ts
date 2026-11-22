import type { Channel, Message } from '@/features/chat';

/** Channel rows as stored by the mock server (unread is computed per user). */
export type ChannelRecord = Omit<Channel, 'unreadCount' | 'lastMessageAt'>;

const MINUTE = 60_000;
const now = () => Date.now();
const ago = (minutes: number) => new Date(now() - minutes * MINUTE).toISOString();

const everyoneButGuest = ['u_ada', 'u_grace', 'u_alan', 'u_katherine', 'u_linus'];

export function createChannelFixtures(): ChannelRecord[] {
  return [
    {
      id: 'c_general',
      kind: 'channel',
      name: 'general',
      topic: 'Company-wide announcements and work-based matters',
      visibility: 'public',
      memberIds: [...everyoneButGuest],
      createdBy: 'u_ada',
      createdAt: ago(60 * 24 * 90),
    },
    {
      id: 'c_random',
      kind: 'channel',
      name: 'random',
      topic: 'Non-work banter and water cooler conversation',
      visibility: 'public',
      memberIds: [...everyoneButGuest],
      createdBy: 'u_ada',
      createdAt: ago(60 * 24 * 90),
    },
    {
      id: 'c_engineering',
      kind: 'channel',
      name: 'engineering',
      topic: 'Private channel for the engineering team',
      visibility: 'private',
      memberIds: ['u_grace', 'u_alan', 'u_katherine'],
      createdBy: 'u_grace',
      createdAt: ago(60 * 24 * 60),
    },
    {
      id: 'c_design',
      kind: 'channel',
      name: 'design-review',
      topic: 'Design critiques, with our partner studio',
      visibility: 'private',
      memberIds: ['u_ada', 'u_alan', 'u_marie'],
      createdBy: 'u_alan',
      createdAt: ago(60 * 24 * 30),
    },
    {
      id: 'c_partners',
      kind: 'channel',
      name: 'partner-launch',
      topic: 'Coordinating the Q1 launch with partners',
      visibility: 'public',
      memberIds: ['u_ada', 'u_linus', 'u_marie'],
      createdBy: 'u_linus',
      createdAt: ago(60 * 24 * 14),
    },
    {
      id: 'g_leads',
      kind: 'group',
      name: '',
      visibility: 'private',
      memberIds: ['u_ada', 'u_grace', 'u_katherine'],
      createdBy: 'u_grace',
      createdAt: ago(60 * 24 * 10),
    },
    {
      id: 'd_ada_grace',
      kind: 'dm',
      name: '',
      visibility: 'private',
      memberIds: ['u_ada', 'u_grace'],
      createdBy: 'u_ada',
      createdAt: ago(60 * 24 * 40),
    },
    {
      id: 'd_ada_alan',
      kind: 'dm',
      name: '',
      visibility: 'private',
      memberIds: ['u_ada', 'u_alan'],
      createdBy: 'u_alan',
      createdAt: ago(60 * 24 * 20),
    },
    {
      id: 'd_ada_marie',
      kind: 'dm',
      name: '',
      visibility: 'private',
      memberIds: ['u_ada', 'u_marie'],
      createdBy: 'u_marie',
      createdAt: ago(60 * 24 * 5),
    },
  ];
}

const generalLines = [
  'Morning everyone! Standup notes are in the wiki.',
  'Reminder: all-hands moves to Thursday this week.',
  'Has anyone seen the updated roadmap deck?',
  "It's in the shared drive under Planning → Q1.",
  'Thanks! Found it.',
  'The new office Wi-Fi password is posted at reception.',
  'Lunch order closes at 11:30 today 🍜',
  'Great work on the release yesterday, team.',
  'Customer feedback summary is ready for review.',
  "I'll walk through it in the product sync.",
  'Can someone from ops confirm the holiday schedule?',
  'Confirmed — offices closed Dec 24 to Jan 1.',
];

const lines: Record<string, string[]> = {
  c_random: [
    'Anyone up for a coffee run?',
    'That cat video was too good 😂',
    'Book club picks next week!',
  ],
  c_engineering: [
    'CI is green again.',
    'Pushed the hotfix for the login bug.',
    'Review on the API PR please?',
  ],
  c_design: [
    'New mocks for onboarding are up.',
    'Love the color update.',
    'Can we try a larger type scale?',
  ],
  c_partners: [
    'Launch checklist v2 attached.',
    'Press release draft is ready.',
    'Partner logos received.',
  ],
  g_leads: ['Headcount plan due Friday.', "Let's sync on priorities tomorrow."],
  d_ada_grace: [
    'Do you have 10 minutes later?',
    'Sure, after 3pm works.',
    'Perfect, I’ll send an invite.',
  ],
  d_ada_alan: ['The new illustrations look great!', 'Thanks, final versions tomorrow.'],
  d_ada_marie: ['Hi Ada, the contract is signed 🎉', 'Wonderful, welcome aboard!'],
};

let sequence = 0;
const nextId = () => `m_${(++sequence).toString().padStart(5, '0')}`;

export function createMessageFixtures(channels: ChannelRecord[]): Message[] {
  sequence = 0;
  const messages: Message[] = [];

  // #general gets enough history to exercise pagination (two pages).
  const general = channels.find((c) => c.id === 'c_general');
  if (general) {
    const total = 45;
    for (let i = 0; i < total; i += 1) {
      messages.push({
        id: nextId(),
        channelId: general.id,
        authorId: general.memberIds[i % general.memberIds.length] ?? 'u_ada',
        body: generalLines[i % generalLines.length] ?? '',
        createdAt: ago((total - i) * 70),
      });
    }
  }

  for (const channel of channels) {
    const channelLines = lines[channel.id];
    if (!channelLines) continue;
    channelLines.forEach((body, index) => {
      messages.push({
        id: nextId(),
        channelId: channel.id,
        authorId: channel.memberIds[(index + 1) % channel.memberIds.length] ?? channel.createdBy,
        body,
        createdAt: ago((channelLines.length - index) * 25),
      });
    });
  }

  // Attach a file reference to one message to exercise the shared Attachment type.
  const launch = messages.find((m) => m.body.startsWith('Launch checklist'));
  if (launch) {
    launch.attachments = [
      {
        id: 'att_1',
        kind: 'file',
        refId: 'f_checklist',
        title: 'launch-checklist-v2.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 182_000,
      },
    ];
  }

  return messages;
}

export const presenceFixture: Record<string, 'online' | 'away' | 'offline'> = {
  u_ada: 'online',
  u_grace: 'online',
  u_alan: 'away',
  u_katherine: 'online',
  u_linus: 'offline',
  u_marie: 'away',
};
