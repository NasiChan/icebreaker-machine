export enum ContextType {
  FirstDate = 'First Date 💘',
  FriendHangout = 'Friend Hangout 🧋',
  Classmates = 'New Classmates 🏫',
  Networking = 'Networking 👔',
  GroupIcebreaker = 'Group Party 🎉'
}

export type ChaosLevel = 1 | 2 | 3 | 4 | 5;

export type FilterType = 'Small Talk' | 'Deep' | 'Silly' | 'Unhinged' | 'Philosophical';

export type GameMode = 'list' | 'spin';

export interface GeneratedQuestion {
  id: string;
  text: string;
  context: ContextType;
  chaosLevel: ChaosLevel;
  filters: FilterType[];
  timestamp: number;
  targetPerson?: string; // For Spin the Bottle mode
}

export interface PromptConfig {
  context: ContextType;
  chaosLevel: ChaosLevel;
  filters: FilterType[];
}