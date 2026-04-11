import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '@/theme/tokens';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scroll?: boolean;
  bg?: string;
}

export function ScreenWrapper({ children, scroll = false, bg }: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.container, { paddingBottom: insets.bottom, backgroundColor: bg || colors.background }]}>
      {children}
    </View>
  );

  if (scroll) {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.scroll}>
        {content}
      </KeyboardAwareScrollView>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
});
