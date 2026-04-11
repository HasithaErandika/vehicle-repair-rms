/**
 * unistyles-compat.ts
 *
 * A zero-native-dependency compatibility shim that replaces react-native-unistyles v3.
 * This allows the app to run in standard Expo Go without requiring a custom native build.
 *
 * Drop-in API surface:
 *   - StyleSheet.create(themeFactory | stylesObject)  → RN StyleSheet
 *   - StyleSheet.configure(...)                       → no-op
 *   - useUnistyles()                                  → { theme }
 */

import { Platform, StyleSheet as RNStyleSheet } from 'react-native';

// Polyfill global StyleSheet for web compatibility (fixes ReferenceError in libs like flash-list)
if (Platform.OS === 'web') {
    const g = global as any;
    if (typeof g.StyleSheet === 'undefined') {
        g.StyleSheet = RNStyleSheet;
    }
}
import { colors, spacing, radii } from '@/theme/tokens';
import { typography } from '@/theme/typography';

// ─── Static theme object (matches AppThemes['light'] from unistyles.ts) ────────
export const theme = {
  colors,
  spacing,
  radii,
  fonts: typography,
} as const;

export type AppTheme = typeof theme;

// ─── StyleSheet shim ─────────────────────────────────────────────────────────
type ThemeFactory<T> = (t: AppTheme) => T;
type StyleInput<T> = T | ThemeFactory<T>;

function _create<T extends Record<string, any>>(input: StyleInput<T>): T {
  const styles = typeof input === 'function' ? (input as ThemeFactory<T>)(theme) : input;

  // Separate any variant functions (e.g. Unistyles dynamic variant `(arg) => ({})`)
  // from plain style objects before passing to RN StyleSheet.create.
  const staticStyles: Record<string, any> = {};
  const dynamicFns: Record<string, (...args: any[]) => any> = {};

  for (const key in styles) {
    if (typeof (styles as any)[key] === 'function') {
      dynamicFns[key] = (styles as any)[key];
    } else {
      staticStyles[key] = (styles as any)[key];
    }
  }

  const sheet = RNStyleSheet.create(staticStyles) as any;

  // Re-attach dynamic variant functions so callers can use styles.headerContainer(inset)
  for (const key in dynamicFns) {
    const fn = dynamicFns[key];
    sheet[key] = (...args: any[]) => RNStyleSheet.create({ _: fn(...args) })['_'];
  }

  return sheet as T;
}

export const StyleSheet = {
  create: _create,
  // configure() is a no-op — the theme is always the static light theme above.
  configure: (_config: any) => {},
  hairlineWidth: RNStyleSheet.hairlineWidth,
  flatten: RNStyleSheet.flatten,
  absoluteFill: RNStyleSheet.absoluteFill,
  absoluteFillObject: RNStyleSheet.absoluteFillObject,
};

// ─── useUnistyles hook ────────────────────────────────────────────────────────
export function useUnistyles() {
  return { theme };
}
