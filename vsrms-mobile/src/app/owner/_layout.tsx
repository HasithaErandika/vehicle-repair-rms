import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, CalendarRange, Wrench, ClipboardList } from 'lucide-react-native';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

const ICONS = {
  index:    LayoutDashboard,
  bookings: CalendarRange,
  jobs:     Wrench,
  logs:     ClipboardList,
};

const LABELS = {
  index:    'My Garages',
  bookings: 'Bookings',
  jobs:     'Active',
  logs:     'Logs',
};

export default function GarageLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} icons={ICONS} labels={LABELS} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="jobs" />
      <Tabs.Screen name="logs" />
      {/* Hidden routes — not in tab bar */}
      <Tabs.Screen name="staff"             options={{ href: null }} />
      <Tabs.Screen name="create-record"     options={{ href: null }} />
      <Tabs.Screen name="workshops/[id]"    options={{ href: null }} />
      <Tabs.Screen name="settings"          options={{ href: null }} />
    </Tabs>
  );
}
