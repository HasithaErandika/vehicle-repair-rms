import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const BRAND = '#F56E0F';
const TEXT = '#111827';
const MUTED = '#9CA3AF';

function AnimatedTabIcon({ name, focused, label }: { name: string; focused: boolean; label: string }) {
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
          color={focused ? BRAND : MUTED} 
        />
      </View>
      <Text style={[styles.label, focused && styles.activeLabel]}>{label}</Text>
    </Animated.View>
  );
}

export default function StaffLayout() {
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

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderTopWidth: 0,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
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
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconWrapper: {
    backgroundColor: '#FFF4EC',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: MUTED,
  },
  activeLabel: {
    color: BRAND,
    fontWeight: '800',
  },
});
