import '@/theme/unistyles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { ErrorBoundary as GlobalErrorBoundary, GlobalErrorBoundary as RouterErrorBoundary } from '@/components/feedback/ErrorBoundary';

import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';

function InitialLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const isRoot = (segments as string[]).length === 0;

    if (!user && !inAuthGroup && !isRoot) {
      // Not logged in and not on a public page, redirect to login
      router.replace('/auth/login' as any);
    } else if (user) {
      // Logged in, redirect based on role if they are NOT in a dashboard group
      const dashboardGroups = ['admin', 'owner', 'technician', 'customer'];
      const isIntro = !dashboardGroups.includes(segments[0] as string);
      
      if (isIntro) {
        switch (user.role) {
          case 'admin':
            router.replace('/admin' as any);
            break;
          case 'workshop_owner':
            router.replace('/owner' as any);
            break;
          case 'workshop_staff':
            router.replace('/technician' as any);
            break;
          case 'customer':
          default:
            router.replace('/customer' as any);
            break;
        }
      }
    }
  }, [user, isLoading, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <GlobalErrorBoundary>                          
      <GestureHandlerRootView style={{ flex: 1 }}>  
        <SafeAreaProvider>                    
          <QueryProvider>                     
            <AuthProvider>                    
              <ToastProvider>                 
                <InitialLayout />
              </ToastProvider>
            </AuthProvider>
          </QueryProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </GlobalErrorBoundary>
  );
}

export function ErrorBoundary(props: any) {
  return <RouterErrorBoundary {...props} />;
}
