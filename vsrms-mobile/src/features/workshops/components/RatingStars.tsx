import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export function RatingStars({ rating, size = 16, showLabel = true }: { rating: number, size?: number, showLabel?: boolean }) {
  const { theme } = useUnistyles();
  const fullStars = Math.floor(rating);

  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          color={i < fullStars ? theme.colors.brand : theme.colors.border}
          fill={i < fullStars ? theme.colors.brand : 'transparent'}
        />
      ))}
      {showLabel && <Text style={styles.text}>{rating.toFixed(1)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  text: { 
    fontSize: theme.fonts.sizes.sm, 
    fontWeight: '700', 
    color: theme.colors.text,
    marginLeft: 4 
  },
}));
