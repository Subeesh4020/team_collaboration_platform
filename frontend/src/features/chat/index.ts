/* Public API of the chat feature. Other code imports only from here. */
export { chatKeys } from './api/chatKeys';
export { ChannelView, type ChannelViewProps } from './components/ChannelView';
export { ChatEmptyState } from './components/ChatEmptyState';
export { ChatNavigation, type ChatNavigationProps } from './components/ChatNavigation';
export { channelResource, chatPermissions } from './permissions';
export { chatTopics } from './realtimeTopics';
export { chatSearchProvider } from './searchProvider';
export {
  CHANNEL_NAME_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  type Channel,
  type ChannelActivityEvent,
  type ChannelId,
  type ChannelKind,
  type ChatMessage,
  type CreateChannelRequest,
  type Message,
  type MessageId,
  type MessageSearchHit,
  type MessagesPage,
  type PostMessageRequest,
} from './types';
