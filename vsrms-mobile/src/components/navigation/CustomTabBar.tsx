import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CustomTabBarProps extends BottomTabBarProps {
  icons: Record<string, any>;
  labels: Record<string, string>;
}

export function CustomTabBar({ state, descriptors, navigation, icons, labels }: CustomTabBarProps) {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

  // Only count routes shown in the tab bar (exclude hidden routes or those without icons)
  const visibleRoutes = state.routes.filter(r => {
    const options = descriptors[r.key].options as any;
    return options.href !== null && !!icons[r.name];
  });
  const totalTabs = visibleRoutes.length;
  const tabWidth  = SCREEN_WIDTH / totalTabs;

  // Map the focused route index → visible index for the sliding pill
  const visibleIndex = visibleRoutes.findIndex(r => r.key === state.routes[state.index]?.key);
  const activeIdx    = visibleIndex >= 0 ? visibleIndex : 0;

  const translateX = useSharedValue(activeIdx * tabWidth);

  useEffect(() => {
    const idx = visibleRoutes.findIndex(r => r.key === state.routes[state.index]?.key);
    translateX.value = withSpring((idx >= 0 ? idx : 0) * tabWidth, {
      damping: 20,
      stiffness: 140,
      mass: 0.7,
    });
  }, [state.index, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: tabWidth,
  }));

  const TAB_HEIGHT = 64;

  return (
    <View style={[
      styles.container,
      { height: TAB_HEIGHT + insets.bottom, paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 0 },
    ]}>
      {/* Sliding active background pill */}
      <Animated.View style={[styles.indicatorWrapper, indicatorStyle, { height: TAB_HEIGHT }]}>
        <View style={styles.activePill} />
      </Animated.View>

      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const Icon      = icons[route.name];
          const label     = labels[route.name] ?? route.name;

          // Skip hidden routes or those without an icon defined
          if ((options as any).href === null || !Icon) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              Icon={Icon}
              label={label}
              isFocused={isFocused}
              brandColor={theme.colors.brand}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

// ── Individual tab item with its own scale animation ────────────────────────

interface TabItemProps {
  Icon: any;
  label: string;
  isFocused: boolean;
  brandColor: string;
  onPress: () => void;
}

function TabItem({ Icon, label, isFocused, brandColor, onPress }: TabItemProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFocused) {
      scale.value = withTiming(1.12, { duration: 120, easing: Easing.out(Easing.quad) }, () => {
        scale.value = withTiming(1, { duration: 100 });
      });
    }
  }, [isFocused]);

  const animatedIcon = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.iconContainer}>
        <Animated.View style={animatedIcon}>
          {Icon && (
            <Icon
              size={22}
              strokeWidth={isFocused ? 2.5 : 1.8}
              color={isFocused ? brandColor : '#9CA3AF'}
            />
          )}
        </Animated.View>
        <Text style={[
          styles.label,
          {
            color:      isFocused ? brandColor : '#9CA3AF',
            fontWeight: isFocused ? '800' : '500',
            opacity:    isFocused ? 1 : 0.75,
          },
        ]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  indicatorWrapper: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    width: 56,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(245,110,15,0.09)',
  },
  tabsRow: {
    flexDirection: 'row',
    flex: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 3,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
}));
