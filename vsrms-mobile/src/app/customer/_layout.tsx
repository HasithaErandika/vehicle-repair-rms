import React, { useEffect } from 'react';
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

function AnimatedTabIcon({
  iconName,
  focused,
  label
}: {
  iconName: { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap };
  focused: boolean;
  label: string;
}) {
  const { theme } = useUnistyles();
  const scale = useSharedValue(focused ? 1.1 : 1);
  const pillOpacity = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.15 : 1, { damping: 15 });
    pillOpacity.value = withSpring(focused ? 1 : 0);
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedPillStyle = useAnimatedStyle(() => ({
    opacity: pillOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.tabItemContainer}>
      <Animated.View style={[styles.pill, animatedPillStyle]} />
      <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
        <Ionicons
          name={focused ? iconName.active : iconName.inactive}
          size={24}
          color={focused ? theme.colors.brand : theme.colors.muted}
        />
        <Text style={[
          styles.label,
          { color: focused ? theme.colors.brand : theme.colors.muted, fontWeight: focused ? '800' : '600' }
        ]}>
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function TabsLayout() {
  const { user, isLoading } = useAuth();
  const { theme } = useUnistyles();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.white }} />;
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.brand,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              iconName={{ active: 'speedometer', inactive: 'speedometer-outline' }}
              focused={focused}
              label="Dashboard"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workshops"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              iconName={{ active: 'map', inactive: 'map-outline' }}
              focused={focused}
              label="Garages"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              iconName={{ active: 'car-sport', inactive: 'car-sport-outline' }}
              focused={focused}
              label="Vehicles"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              iconName={{ active: 'calendar', inactive: 'calendar-outline' }}
              focused={focused}
              label="Schedule"
            />
          ),
        }}
      />

    </Tabs>
  );
}

const styles = StyleSheet.create((theme) => ({
  tabBar: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 0,
    height: 72,
    borderRadius: 36,
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 70,
  },
  pill: {
    position: 'absolute',
    width: 64,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.brandSoft,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
}));
