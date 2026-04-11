import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ChevronLeft, Bell } from 'lucide-react-native';

interface CustomHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: 'notifications' | 'profile' | 'none';
  onRightPress?: () => void;
  role?: 'user' | 'admin' | 'garage' | 'staff'; // For conditional role-based styling if needed later
}

export function CustomHeader({
  title,
  showBack = false,
  rightAction = 'none',
  onRightPress,
  role = 'user',
}: CustomHeaderProps) {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Different roles can have different accent colors or slight variants
  const isElevated = role === 'admin' || role === 'garage';

  return (
    <View style={[styles.headerContainer(insets.top), isElevated && styles.elevated]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          >
            <ChevronLeft color={theme.colors.text} size={24} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        {rightAction === 'notifications' && (
          <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
            <Bell color={theme.colors.text} size={22} />
          </TouchableOpacity>
        )}
        {rightAction === 'profile' && (
          <TouchableOpacity style={styles.profileBadge} onPress={onRightPress}>
            <Text style={styles.profileText}>U</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  headerContainer: (topInset: number) => ({
    paddingTop: topInset,
    height: topInset + 60, // Fixed physical height after safe area
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    zIndex: 50,
  }),
  elevated: {
    borderBottomWidth: 0,
    boxShadow: [{
      offsetX: 0,
      offsetY: 2,
      blurRadius: 8,
      color: 'rgba(0,0,0,0.05)',
    }],
    elevation: 4,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.surface,
  },
  profileBadge: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.brand,
  },
  profileText: {
    color: theme.colors.brand,
    fontWeight: '700',
    fontSize: theme.fonts.sizes.sm,
  },
}));
