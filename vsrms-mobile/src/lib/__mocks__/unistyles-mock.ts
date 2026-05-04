/**
 * Minimal mock for react-native-unistyles for Jest testing.
 * Provides a dummy theme and StyleSheet.create implementation.
 */

const mockTheme = {
  colors: {
    brand: '#F56E0F',
    brandSoft: 'rgba(245, 110, 15, 0.08)',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#1A1A2E',
    muted: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    white: '#FFFFFF',
    black: '#000000',
    successBackground: '#ECFDF5',
    successText: '#047857',
    warningBackground: '#FFFBEB',
    warningText: '#D97706',
    errorBackground: '#FEF2F2',
    errorText: '#B91C1C',
  },
  typography: {
    sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20 },
    weights: { regular: '400', medium: '500', bold: '700' },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
};

export const StyleSheet = {
  create: (styleFn: (theme: any) => any) => {
    if (typeof styleFn === 'function') {
      return styleFn(mockTheme);
    }
    return styleFn;
  },
};

export const UnistylesRuntime = {
  themeName: 'light',
  setTheme: () => {},
};

export const useStyles = () => ({
  theme: mockTheme,
  styles: {},
});
