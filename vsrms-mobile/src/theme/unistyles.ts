import { StyleSheet } from 'react-native-unistyles';
import { breakpoints } from './breakpoints';
import { colors, spacing, radii } from './tokens';
import { typography } from './typography';

export const lightTheme = {
  colors,
  spacing,
  radii,
  fonts: typography,
} as const;

type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  light: typeof lightTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  breakpoints,
  themes: {
    light: lightTheme,
  },
  settings: {
    initialTheme: 'light',
    adaptiveThemes: false,
  },
});
