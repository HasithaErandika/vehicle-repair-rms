export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

export const colors = {
  // Brand
  brand: '#F56E0F',
  brandSoft: 'rgba(245, 110, 15, 0.08)',
  brandMuted: 'rgba(245, 110, 15, 0.15)',
  brandFaint: 'rgba(245, 110, 15, 0.06)',
  
  // Base
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceAlt: '#FAFAFA',
  text: '#1A1A2E',
  textDim: '#374151',
  muted: '#6B7280',
  mutedLight: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Semantic
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#2563EB',
  
  // Semantic Backgrounds
  successBackground: '#ECFDF5',
  successText: '#047857',
  warningBackground: '#FFFBEB',
  warningText: '#D97706',
  errorBackground: '#FEF2F2',
  errorText: '#B91C1C',
  infoBackground: '#EFF6FF',
  infoText: '#2563EB',
  
  // Translucent / Overlays
  whiteAlpha10: 'rgba(255, 255, 255, 0.1)',
  whiteAlpha20: 'rgba(255, 255, 255, 0.2)',
  whiteAlpha70: 'rgba(255, 255, 255, 0.7)',
  blackAlpha60: 'rgba(0, 0, 0, 0.6)',
  
  // Constants
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  // Layout Standards
  screenPadding: 24,
  headerBottom: 64,
  cardOverlap: -38,
  tabBarHeight: 90,
  listBottomPadding: 130,
} as const;

export const radii = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    // Semantic Standards
    pageTitle: 28,
    title: 20,
    cardTitle: 18,
    sectionTitle: 16,
    caption: 11,
    body: 14,
    subtitle: 16,
  },
} as const;
