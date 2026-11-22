/**
 * Interfaces for calls and screen sharing. NO IMPLEMENTATION YET.
 *
 * The meetings feature will depend only on these types. A concrete adapter
 * (proposed: LiveKit via `livekit-client`) will implement `RtcClient` later,
 * so the vendor can be swapped without touching feature code.
 */
import type { UserId } from '@/types';

export type RtcConnectionState =
  'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

export type TrackKind = 'audio' | 'video' | 'screen';

export interface RtcTrack {
  id: string;
  kind: TrackKind;
  muted: boolean;
  /** Attaches the track to a media element for playback. */
  attach(element: HTMLMediaElement): void;
  detach(element: HTMLMediaElement): void;
}

export interface RtcParticipant {
  id: string;
  userId: UserId;
  displayName: string;
  isLocal: boolean;
  isSpeaking: boolean;
  tracks: readonly RtcTrack[];
}

export interface RtcJoinOptions {
  /** Short-lived token issued by the backend for this room. */
  token: string;
  audio: boolean;
  video: boolean;
}

export interface RtcSessionEvents {
  'state-changed': RtcConnectionState;
  'participant-joined': RtcParticipant;
  'participant-left': RtcParticipant;
  'participant-updated': RtcParticipant;
  'active-speakers-changed': readonly RtcParticipant[];
  'recording-changed': { isRecording: boolean };
}

export interface RtcSession {
  readonly roomId: string;
  readonly state: RtcConnectionState;
  readonly localParticipant: RtcParticipant;
  readonly participants: readonly RtcParticipant[];

  setMicrophoneEnabled(enabled: boolean): Promise<void>;
  setCameraEnabled(enabled: boolean): Promise<void>;
  startScreenShare(): Promise<void>;
  stopScreenShare(): Promise<void>;

  on<E extends keyof RtcSessionEvents>(
    event: E,
    listener: (payload: RtcSessionEvents[E]) => void,
  ): () => void;

  leave(): Promise<void>;
}

export interface RtcClient {
  join(roomId: string, options: RtcJoinOptions): Promise<RtcSession>;
  /** Lists available input devices for the device picker. */
  listDevices(kind: 'audioinput' | 'videoinput' | 'audiooutput'): Promise<MediaDeviceInfo[]>;
}
