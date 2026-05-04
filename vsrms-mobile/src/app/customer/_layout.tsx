import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { View } from 'react-native';
import { Home, MapPin, Car, CalendarCheck, Settings } from 'lucide-react-native';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';
import { useUnistyles } from 'react-native-unistyles';

const ICONS = {
  index:     Home,
  workshops: MapPin,
  vehicles:  Car,
  schedule:  CalendarCheck,
  settings:  Settings,
};

const LABELS = {
  index:     'Home',
  workshops: 'Find',
  vehicles:  'Vehicles',
  schedule:  'Schedule',
  settings:  'Settings',
};

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
      tabBar={(props) => <CustomTabBar {...props} icons={ICONS} labels={LABELS} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="workshops" />
      <Tabs.Screen name="vehicles" />
      <Tabs.Screen name="schedule" />
      <Tabs.Screen name="reviews" options={{ href: null }} />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
