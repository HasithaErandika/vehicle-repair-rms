import React from 'react';
import { Tabs } from 'expo-router';
import { Gauge, CalendarClock, ClipboardCheck, FilePlus, Settings2 } from 'lucide-react-native';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

const ICONS = {
  index:        Gauge,
  appointments: CalendarClock,
  tracker:      ClipboardCheck,
  record:       FilePlus,
  settings:     Settings2,
};

const LABELS = {
  index:        'Overview',
  appointments: 'Schedule',
  tracker:      'Tracker',
  record:       'New Log',
  settings:     'Settings',
};

export default function StaffLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} icons={ICONS} labels={LABELS} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="appointments" />
      <Tabs.Screen name="tracker" />
      <Tabs.Screen name="record" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
