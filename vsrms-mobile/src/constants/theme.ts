import { colors, spacing, radii } from '../theme/tokens';

export const Spacing = {
  none:  spacing.none,
  one:   spacing.xs,
  two:   spacing.sm,
  three: spacing.md,
  four:  spacing.lg,
  five:  spacing.xl,
  six:   spacing.xxl,
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
