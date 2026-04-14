import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Building2, CalendarClock, History, Settings2 } from 'lucide-react-native';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

const ICONS = {
  index:            Home,
  'workshops/list': Building2,
  bookings:         CalendarClock,
  logs:             History,
  settings:         Settings2,
};

const LABELS = {
  index:            'Home',
  'workshops/list': 'Garages',
  bookings:         'Schedule',
  logs:             'Activity',
  settings:         'Settings',
};

export default function GarageLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} icons={ICONS} labels={LABELS} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="workshops/list" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="logs" />
      <Tabs.Screen name="settings" />
      
      {/* Hidden routes — not in tab bar */}
      <Tabs.Screen name="jobs"              options={{ href: null }} />
      <Tabs.Screen name="staff"             options={{ href: null }} />
      <Tabs.Screen name="create-record"     options={{ href: null }} />
      <Tabs.Screen name="workshops/[id]"    options={{ href: null }} />
    </Tabs>
  );
}
