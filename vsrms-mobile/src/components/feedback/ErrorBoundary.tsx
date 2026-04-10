import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <GlobalErrorBoundary error={this.state.error!} retry={() => this.setState({ hasError: false, error: null })} />;
    }
    return this.props.children;
  }
}

export function GlobalErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertCircle color={theme.colors.error || '#EF4444'} size={48} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.subtitle}>{error.message || 'An unexpected error occurred.'}</Text>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={retry}>
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.errorBackground || 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  actionContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  button: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.brand,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: theme.fonts.sizes.md,
  },
}));
