import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scroll?: boolean;
}

export function ScreenWrapper({ children, scroll = false }: ScreenWrapperProps) {
  const insets = useUnistyles().rt.insets;

  const content = (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
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

const styles = StyleSheet.create((theme) => ({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  scroll: {
    flexGrow: 1,
  }
}));
