import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Review } from '../types/reviews.types';

export function ReviewCard({ review }: { review: Review }) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.ratingRow}>
          <Star size={16} fill={theme.colors.warning} color={theme.colors.warning} />
          <Text style={styles.ratingText}>{review.rating}/5</Text>
        </View>
        <Text style={styles.dateText}>{new Date(review.createdAt || Date.now()).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, padding: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: theme.fonts.sizes.sm, fontWeight: '700', color: theme.colors.text },
  dateText: { fontSize: theme.fonts.sizes.xs, color: theme.colors.muted },
  comment: { fontSize: theme.fonts.sizes.sm, color: theme.colors.text, lineHeight: 20 },
}));
