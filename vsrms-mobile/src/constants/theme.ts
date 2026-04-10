import { colors, spacing, radii } from '../theme/tokens';

export const Colors = {
  light: {
    primary:      colors.brand,
    primaryMuted: colors.brandSoft,
    background:   colors.background,
    surface:      colors.surface,
    text:         colors.text,
    textMuted:    colors.muted,
    border:       colors.border,
    error:        colors.error,
    success:      colors.success,
    warning:      colors.warning,
  },
};

export const Spacing = {
  none:  spacing.none,
  one:   spacing.xs,
  two:   spacing.sm,
  three: spacing.md,
  four:  spacing.lg,
  five:  spacing.xl,
  six:   spacing.xxl,
};

export const CustomBorders = {
  radius: {
    sm:   radii.sm,
    md:   radii.md,
    lg:   radii.lg,
    xl:   radii.xl,
    full: radii.full,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const BottomTabInset = 16;
export const MaxContentWidth = 1200;
