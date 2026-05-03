import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

interface AppLogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'dark' | 'light';
}

export function AppLogo({ size = 120, showText = false, variant = 'dark' }: AppLogoProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../../../assets/logo.svg')}
        style={{ width: size, height: size }}
        contentFit="contain"
      />
    </View>
  );
}

export function AppLogoIcon({ size = 48 }: { size?: number }) {
  return <AppLogo size={size} showText={false} />;
}
