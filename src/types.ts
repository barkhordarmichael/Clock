export type MovementType = 'sweep' | 'tick';
export type ClockSize = 'compact' | 'standard' | 'large';

export interface ClockTheme {
  id: string;
  name: string;
  era: string;
  description: string;
  bezelOuter: string;
  bezelInner: string;
  bezelHighlight: string;
  bezelAccent: string;
  dialBg: string;
  dialTextureGradient: [string, string, string];
  dialBorder: string;
  textColor: string;
  subTextColor: string;
  minuteTickColor: string;
  hourTickColor: string;
  hourNumeralFont: string;
  numeralStyle: 'roman' | 'arabic' | 'minimal' | 'military';
  hourHandColor: string;
  hourHandAccent?: string;
  minuteHandColor: string;
  minuteHandAccent?: string;
  secondHandColor: string;
  secondHandCapColor: string;
  handStyle: 'spade' | 'baton' | 'syringe' | 'teardrop';
  pinionColor: string;
  accentColor: string;
  dateBoxBg: string;
  dateBoxBorder: string;
  dateTextColor: string;
  brandText: string;
  originText: string;
}

export interface ClockSettings {
  themeId: string;
  movement: MovementType;
  tickSound: boolean;
  volume: number;
  hourlyChime: boolean;
  showDate: boolean;
  showSubdial: boolean;
  showDigital: boolean;
  glassReflection: boolean;
  size: ClockSize;
}
