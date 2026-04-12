import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  interpolate 
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
  
  // Only count routes that are actually shown in the tab bar (not href:null hidden routes)
  const visibleRoutes = state.routes.filter(r => (descriptors[r.key].options as any).href !== null);
  const totalTabs = visibleRoutes.length;
  const tabWidth = SCREEN_WIDTH / totalTabs;

  // Map focused index to visible-route index for the sliding indicator
  const visibleIndex = visibleRoutes.findIndex(r => r.key === state.routes[state.index]?.key);

  // Shared value for sliding indicator
  const translateX = useSharedValue((visibleIndex >= 0 ? visibleIndex : 0) * tabWidth);

  useEffect(() => {
    const idx = visibleRoutes.findIndex(r => r.key === state.routes[state.index]?.key);
    translateX.value = withSpring((idx >= 0 ? idx : 0) * tabWidth, {
      damping: 18,
      stiffness: 120,
      mass: 0.8,
    });
  }, [state.index, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: tabWidth,
  }));

  return (
    <View style={[
      styles.container, 
      { 
        height: 64 + insets.bottom, 
        paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 0 
      }
    ]}>
      {/* Sliding Active Indicator */}
      <Animated.View style={[styles.indicatorWrapper, indicatorStyle]}>
        <View style={styles.activePill} />
      </Animated.View>

      {/* Tab Items */}
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const Icon = icons[route.name];
          const label = labels[route.name] || route.name;
          if ((options as any).href === null) return null;

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
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {Icon && (
                  <Icon
                    size={20}
                    strokeWidth={isFocused ? 2.5 : 2}
                    color={isFocused ? theme.colors.brand : '#9CA3AF'}
                  />
                )}
                <Text style={[
                  styles.label, 
                  { 
                    color: isFocused ? theme.colors.brand : theme.colors.muted,
                    fontWeight: isFocused ? '800' : '600'
                  }
                ]}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

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
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  indicatorWrapper: {
    position: 'absolute',
    top: 0,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    width: 60,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(245,110,15,0.08)',
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
    height: 48,
  },
  label: {
    fontSize: 9,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
}));
