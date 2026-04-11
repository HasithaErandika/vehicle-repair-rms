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
    boxShadow: [{
      offsetX: 0,
      offsetY: 1,
      blurRadius: 1.0,
      color: 'rgba(0,0,0,0.18)',
    }],
    elevation: 1,
  },
  md: {
    boxShadow: [{
      offsetX: 0,
      offsetY: 2,
      blurRadius: 2.62,
      color: 'rgba(0,0,0,0.23)',
    }],
    elevation: 4,
  },
  lg: {
    boxShadow: [{
      offsetX: 0,
      offsetY: 4,
      blurRadius: 4.65,
      color: 'rgba(0,0,0,0.30)',
    }],
    elevation: 8,
  },
};

export const BottomTabInset = 16;
export const MaxContentWidth = 1200;
