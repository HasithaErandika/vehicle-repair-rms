import React from 'react';
import { View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scroll?: boolean;
  bg?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
}

export function ScreenWrapper({ 
  children, 
  scroll = false, 
  bg,
  statusBarStyle = 'light-content'
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const finalBg = bg ?? theme.colors.background;

  const content = (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: finalBg,
        },
      ]}
    >
      <StatusBar 
        barStyle={statusBarStyle} 
        backgroundColor={finalBg}
        translucent
      />
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

const styles = StyleSheet.create(() => ({
  container: { flex: 1 },
  scroll: { flexGrow: 1 },
}));
