import { StyleSheet } from 'react-native-unistyles';
import { breakpoints, colors, spacing, radii, typography } from './tokens';

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
