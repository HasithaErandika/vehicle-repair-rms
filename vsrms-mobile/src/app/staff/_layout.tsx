import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

function AnimatedTabIcon({ name, focused, label }: { name: string; focused: boolean; label: string }) {
  const { theme } = useUnistyles();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(focused ? 1.15 : 1) }],
    };
  });

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
      <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
        <Ionicons
          name={focused ? (name as any) : (`${name}-outline` as any)}
          size={22}
          color={focused ? theme.colors.brand : theme.colors.muted}
        />
      </View>
      <Text style={[styles.label, focused && styles.activeLabel]}>{label}</Text>
    </Animated.View>
  );
}

export default function StaffLayout() {
  const { theme } = useUnistyles();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon name="home" focused={focused} label="My Tasks" />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon name="calendar" focused={focused} label="Appts" />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon name="hammer" focused={focused} label="Jobs" />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon name="document-text" focused={focused} label="Records" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create((theme) => ({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 72,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.xxl,
    borderTopWidth: 0,
    boxShadow: [{
      offsetX: 0,
      offsetY: 10,
      blurRadius: 20,
      color: 'rgba(0,0,0,0.12)',
    }],
    elevation: 15,
    paddingBottom: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    marginTop: 10,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconWrapper: {
    backgroundColor: theme.colors.brandSoft,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.muted,
  },
  activeLabel: {
    color: theme.colors.brand,
    fontWeight: '800',
  },
}));
