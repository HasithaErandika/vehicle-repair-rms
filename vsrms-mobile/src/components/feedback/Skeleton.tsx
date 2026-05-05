import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export function Skeleton({ width, height, borderRadius = 8 }: { width: number | string; height: number; borderRadius?: number }) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  const { theme } = useUnistyles();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        width: width as any,
        height,
        borderRadius,
        backgroundColor: theme.colors.border,
        opacity,
      }}
    />
  );
}

export function VehicleSkeleton() {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3].map((idx) => (
        <View key={idx} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Skeleton width={52} height={52} borderRadius={12} />
          <View style={styles.textGroup}>
            <Skeleton width="70%" height={16} borderRadius={6} />
            <View style={{ height: 6 }} />
            <Skeleton width="45%" height={12} borderRadius={6} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  card: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    gap: 14,
  },
  textGroup: { flex: 1 },
}));
