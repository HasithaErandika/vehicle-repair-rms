import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const url = await Linking.getInitialURL();
      if (url != null) {
        const parsed = Linking.parse(url);
        const code = parsed.queryParams?.code as string;
        const state = parsed.queryParams?.state as string;

        if (code) {
          // Pass code back to login screen via navigation state
          router.replace({
            pathname: '/auth/login',
            params: { code, state },
          });
        } else {
          router.replace('/auth/login');
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12 }}>Processing login...</Text>
    </View>
  );
}
