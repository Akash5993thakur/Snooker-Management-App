import { TextStyle } from 'react-native';

// Light theme (owner-directed 2026-08-28): white ground, blue accent.
// Token NAMES kept from the Felt & Brass spec so components stay untouched;
// `brass` is now the blue accent, `accentSoft` is the primary-button fill.
export const C = {
  ground: '#FFFFFF',
  surface: '#F5F7F9',
  surface2: '#EDF1F4',
  rule: '#D9DEE3',
  ruleFaint: '#E9EDF0',
  ink: '#15181B',
  inkDim: '#4E5A64',
  inkFaint: '#7C8790',
  inkMute: '#AEB7BE',
  brass: '#1558D6',
  brassInk: '#FFFFFF',
  accentSoft: '#E7EEFB',
  live: '#D7301F',
  liveInk: '#FFFFFF',
  felt: '#1E7A4C',
  feltText: '#177347',
  scrim: 'rgba(9, 14, 20, 0.45)',
} as const;

export const S = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 26,
  s7: 32,
  radius: 0,
  rule: 2,
  ruleAccent: 5,
  tapMin: 44,
  tapPrimary: 48,
  statusBar: 44,
  header: 72,
  tabBar: 84,
  scrollTop: 116,
} as const;

export const T: Record<string, TextStyle> = {
  display: { fontFamily: 'Archivo_800ExtraBold', fontSize: 34, lineHeight: 34, letterSpacing: -0.34 },
  h1: { fontFamily: 'Archivo_800ExtraBold', fontSize: 26, lineHeight: 28, letterSpacing: -0.26 },
  h2: { fontFamily: 'Archivo_800ExtraBold', fontSize: 22, lineHeight: 24, letterSpacing: -0.22 },
  h3: { fontFamily: 'Archivo_700Bold', fontSize: 18, lineHeight: 22, letterSpacing: 0 },
  h4: { fontFamily: 'Archivo_700Bold', fontSize: 17, lineHeight: 22, letterSpacing: 0 },
  body: { fontFamily: 'Archivo_600SemiBold', fontSize: 15, lineHeight: 20, letterSpacing: 0 },
  bodySm: { fontFamily: 'Archivo_600SemiBold', fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  label: { fontFamily: 'Archivo_800ExtraBold', fontSize: 13, lineHeight: 16, letterSpacing: 1.8, textTransform: 'uppercase' },
  micro: { fontFamily: 'Archivo_800ExtraBold', fontSize: 11, lineHeight: 14, letterSpacing: 1.3, textTransform: 'uppercase' },
  nano: { fontFamily: 'Archivo_800ExtraBold', fontSize: 10, lineHeight: 13, letterSpacing: 1.2, textTransform: 'uppercase' },
  monoXl: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 34, lineHeight: 34, letterSpacing: 0 },
  monoDisplay: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 44, lineHeight: 44, letterSpacing: 0 },
  monoLg: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 26, lineHeight: 28, letterSpacing: 0 },
  monoMd: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 16, lineHeight: 20, letterSpacing: 0 },
  monoSm: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 13, lineHeight: 18, letterSpacing: 0 },
};
