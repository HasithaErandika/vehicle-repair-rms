import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Warehouse, Users } from 'lucide-react-native';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

const ICONS = {
  index: LayoutDashboard,
  garages: Warehouse,
  users: Users,
};

const LABELS = {
  index: 'Dashboard',
  garages: 'Garages',
  users: 'Users',
};

export default function AdminLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} icons={ICONS} labels={LABELS} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="garages" />
      <Tabs.Screen name="users" />
      {/* Hidden routes — not in tab bar */}
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
