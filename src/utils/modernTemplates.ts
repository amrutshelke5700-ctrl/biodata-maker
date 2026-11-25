export type ModernColorKey =
  | 'indigo'
  | 'midnight'
  | 'emerald'
  | 'violet'
  | 'crimson'
  | 'cobalt'
  | 'terracotta'
  | 'forest'
  | 'burgundy'
  | 'sapphire'
  | 'plum'
  | 'bronze'
  | 'nordic'
  | 'rosequartz'
  | 'olive'
  | 'graphite'
  | 'peacock'
  | 'vermilion'
  | 'lavender'
  | 'obsidian';

export type ModernStyleKey =
  | 'top-bar'
  | 'left-sidebar'
  | 'split-card'
  | 'geometric-corner'
  | 'minimal-accent';

export type ModernTemplateId = `modern-${ModernColorKey}-${ModernStyleKey}`;

export interface ModernColorTheme {
  key: ModernColorKey;
  primary: string;
  secondary: string;
  accent: string;
  paperBg: string;
  sectionBg: string;
  dividerColor: string;
  borderColor: string;
  bannerSubColor: string;
  recommendedFor: 'marriage' | 'job';
}

export interface ModernStyleDefinition {
  key: ModernStyleKey;
}

export interface ModernTemplateSpec {
  id: ModernTemplateId;
  color: ModernColorTheme;
  style: ModernStyleKey;
  recommendedFor: 'marriage' | 'job';
}

export const MODERN_COLOR_THEMES: readonly ModernColorTheme[] = [
  {
    key: 'indigo',
    primary: '#312E81',
    secondary: '#4338CA',
    accent: '#4F46E5',
    paperBg: '#FFFFFF',
    sectionBg: '#EEF2FF',
    dividerColor: '#C7D2FE',
    borderColor: '#A5B4FC',
    bannerSubColor: '#E0E7FF',
    recommendedFor: 'job',
  },
  {
    key: 'midnight',
    primary: '#0F172A',
    secondary: '#1E293B',
    accent: '#334155',
    paperBg: '#FFFFFF',
    sectionBg: '#F1F5F9',
    dividerColor: '#CBD5E1',
    borderColor: '#94A3B8',
    bannerSubColor: '#E2E8F0',
    recommendedFor: 'job',
  },
  {
    key: 'emerald',
    primary: '#065F46',
    secondary: '#047857',
    accent: '#10B981',
    paperBg: '#FAFEFC',
    sectionBg: '#ECFDF5',
    dividerColor: '#A7F3D0',
    borderColor: '#6EE7B7',
    bannerSubColor: '#D1FAE5',
    recommendedFor: 'marriage',
  },
  {
    key: 'violet',
    primary: '#581C87',
    secondary: '#7E22CE',
    accent: '#9333EA',
    paperBg: '#FDFCFF',
    sectionBg: '#FAF5FF',
    dividerColor: '#E9D5FF',
    borderColor: '#D8B4FE',
    bannerSubColor: '#F3E8FF',
    recommendedFor: 'marriage',
  },
  {
    key: 'crimson',
    primary: '#9F1239',
    secondary: '#BE123C',
    accent: '#E11D48',
    paperBg: '#FFFCFD',
    sectionBg: '#FFF1F2',
    dividerColor: '#FECDD3',
    borderColor: '#FDA4AF',
    bannerSubColor: '#FFE4E6',
    recommendedFor: 'marriage',
  },
  {
    key: 'cobalt',
    primary: '#155E75',
    secondary: '#0E7490',
    accent: '#0891B2',
    paperBg: '#FFFFFF',
    sectionBg: '#ECFEFF',
    dividerColor: '#A5F3FC',
    borderColor: '#67E8F9',
    bannerSubColor: '#CFFAFE',
    recommendedFor: 'job',
  },
  {
    key: 'terracotta',
    primary: '#9A3412',
    secondary: '#C2410C',
    accent: '#EA580C',
    paperBg: '#FFFCFA',
    sectionBg: '#FFF7ED',
    dividerColor: '#FED7AA',
    borderColor: '#FDBA74',
    bannerSubColor: '#FFEDD5',
    recommendedFor: 'marriage',
  },
  {
    key: 'forest',
    primary: '#14532D',
    secondary: '#15803D',
    accent: '#16A34A',
    paperBg: '#FBFEFC',
    sectionBg: '#F0FDF4',
    dividerColor: '#BBF7D0',
    borderColor: '#86EFAC',
    bannerSubColor: '#DCFCE7',
    recommendedFor: 'marriage',
  },
  {
    key: 'burgundy',
    primary: '#881337',
    secondary: '#9F1239',
    accent: '#BE185D',
    paperBg: '#FFFCFD',
    sectionBg: '#FDF2F8',
    dividerColor: '#FBCFE8',
    borderColor: '#F9A8D4',
    bannerSubColor: '#FCE7F3',
    recommendedFor: 'marriage',
  },
  {
    key: 'sapphire',
    primary: '#1E40AF',
    secondary: '#1D4ED8',
    accent: '#2563EB',
    paperBg: '#FFFFFF',
    sectionBg: '#EFF6FF',
    dividerColor: '#BFDBFE',
    borderColor: '#93C5FD',
    bannerSubColor: '#DBEAFE',
    recommendedFor: 'job',
  },
  {
    key: 'plum',
    primary: '#701A75',
    secondary: '#86198F',
    accent: '#A21CAF',
    paperBg: '#FEFBFD',
    sectionBg: '#FDF4FF',
    dividerColor: '#F5D0FE',
    borderColor: '#F0ABFC',
    bannerSubColor: '#FAE8FF',
    recommendedFor: 'marriage',
  },
  {
    key: 'bronze',
    primary: '#78350F',
    secondary: '#92400E',
    accent: '#B45309',
    paperBg: '#FFFDF8',
    sectionBg: '#FFFBEB',
    dividerColor: '#FDE68A',
    borderColor: '#FCD34D',
    bannerSubColor: '#FEF3C7',
    recommendedFor: 'marriage',
  },
  {
    key: 'nordic',
    primary: '#0C4A6E',
    secondary: '#0369A1',
    accent: '#0284C7',
    paperBg: '#FFFFFF',
    sectionBg: '#F0F9FF',
    dividerColor: '#BAE6FD',
    borderColor: '#7DD3FC',
    bannerSubColor: '#E0F2FE',
    recommendedFor: 'job',
  },
  {
    key: 'rosequartz',
    primary: '#831843',
    secondary: '#9D174D',
    accent: '#DB2777',
    paperBg: '#FFFBFD',
    sectionBg: '#FDF2F8',
    dividerColor: '#FBCFE8',
    borderColor: '#F472B6',
    bannerSubColor: '#FCE7F3',
    recommendedFor: 'marriage',
  },
  {
    key: 'olive',
    primary: '#3F6212',
    secondary: '#4D7C0F',
    accent: '#65A30D',
    paperBg: '#FCFEF9',
    sectionBg: '#F7FEE7',
    dividerColor: '#D9F99D',
    borderColor: '#BEF264',
    bannerSubColor: '#ECFCCB',
    recommendedFor: 'job',
  },
  {
    key: 'graphite',
    primary: '#27272A',
    secondary: '#3F3F46',
    accent: '#52525B',
    paperBg: '#FFFFFF',
    sectionBg: '#F4F4F5',
    dividerColor: '#D4D4D8',
    borderColor: '#A1A1AA',
    bannerSubColor: '#E4E4E7',
    recommendedFor: 'job',
  },
  {
    key: 'peacock',
    primary: '#115E59',
    secondary: '#0F766E',
    accent: '#0D9488',
    paperBg: '#FFFFFF',
    sectionBg: '#F0FDFA',
    dividerColor: '#99F6E4',
    borderColor: '#5EEAD4',
    bannerSubColor: '#CCFBF1',
    recommendedFor: 'job',
  },
  {
    key: 'vermilion',
    primary: '#991B1B',
    secondary: '#B91C1C',
    accent: '#DC2626',
    paperBg: '#FFFCFB',
    sectionBg: '#FEF2F2',
    dividerColor: '#FECACA',
    borderColor: '#FCA5A5',
    bannerSubColor: '#FEE2E2',
    recommendedFor: 'marriage',
  },
  {
    key: 'lavender',
    primary: '#4C1D95',
    secondary: '#5B21B6',
    accent: '#7C3AED',
    paperBg: '#FDFCFF',
    sectionBg: '#F5F3FF',
    dividerColor: '#DDD6FE',
    borderColor: '#C4B5FD',
    bannerSubColor: '#EDE9FE',
    recommendedFor: 'job',
  },
  {
    key: 'obsidian',
    primary: '#18181B',
    secondary: '#854D0E',
    accent: '#A16207',
    paperBg: '#FFFFFF',
    sectionBg: '#FEFCE8',
    dividerColor: '#E5E7EB',
    borderColor: '#CA8A04',
    bannerSubColor: '#FEF08A',
    recommendedFor: 'job',
  },
] as const;

export const MODERN_STYLE_DEFINITIONS: readonly ModernStyleDefinition[] = [
  { key: 'top-bar' },
  { key: 'left-sidebar' },
  { key: 'split-card' },
  { key: 'geometric-corner' },
  { key: 'minimal-accent' },
] as const;

// 20 colors × 5 styles = 100 distinct modern templates
export const MODERN_TEMPLATE_SPECS: ModernTemplateSpec[] = MODERN_COLOR_THEMES.flatMap((color) =>
  MODERN_STYLE_DEFINITIONS.map((style) => ({
    id: `modern-${color.key}-${style.key}` as ModernTemplateId,
    color,
    style: style.key,
    recommendedFor: color.recommendedFor,
  }))
);

export const MODERN_TEMPLATE_MAP: Record<string, ModernTemplateSpec> = Object.fromEntries(
  MODERN_TEMPLATE_SPECS.map((spec) => [spec.id, spec])
);

export function getModernTemplateSpec(id: string): ModernTemplateSpec | undefined {
  return MODERN_TEMPLATE_MAP[id];
}
