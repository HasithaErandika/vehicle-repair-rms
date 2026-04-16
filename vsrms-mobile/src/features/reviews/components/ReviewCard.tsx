import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useAuth } from '@/hooks';
import { Review } from '../types/reviews.types';
import { ReviewActionSheet } from './ReviewActionSheet';

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color={i <= rating ? '#F59E0B' : '#D1D5DB'}
        />
      ))}
    </View>
  );
}

function getUserLabel(userId: Review['userId']): string {
  if (typeof userId === 'object' && userId) return userId.fullName ?? userId.email ?? 'Anonymous';
  return 'Customer';
}

function getUserInitial(userId: Review['userId']): string {
  const label = getUserLabel(userId);
  return label[0]?.toUpperCase() ?? '?';
}

export function ReviewCard({ 
  review, 
  onEdit, 
  onDelete 
}: { 
  review: Review; 
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
}) {
  const { theme } = useUnistyles();
  const { user: authUser } = useAuth();
  const [sheetVisible, setSheetVisible] = React.useState(false);

  const getReviewOwnerId = (): string | null => {
    if (!review.userId) return null;
    if (typeof review.userId === 'object') {
      return (review.userId.id || (review.userId as any)._id || '').toString();
    }
    return review.userId.toString();
  };

  const getAuthUserId = (): string | null => {
    if (!authUser) return null;
    return (authUser.id || (authUser as any)._id || '').toString();
  };

  const reviewOwnerId = getReviewOwnerId();
  const authUserId = getAuthUserId();
  const isOwner = !!authUserId && !!reviewOwnerId && authUserId === reviewOwnerId;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getUserInitial(review.userId)}</Text>
        </View>
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{getUserLabel(review.userId)}</Text>
          <StarRating rating={review.rating} />
        </View>
        <View style={styles.rightHeader}>
          <Text style={styles.dateText}>
            {new Date(review.createdAt || Date.now()).toLocaleDateString('en-LK', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </Text>
          {isOwner && (
            <TouchableOpacity 
              style={styles.optionsBtn} 
              onPress={() => setSheetVisible(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {review.reviewText ? (
        <Text style={styles.comment}>{review.reviewText}</Text>
      ) : null}

      <ReviewActionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onEdit={() => onEdit?.(review)}
        onDelete={() => onDelete?.(review)}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: theme.colors.brandSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '800', color: theme.colors.brand },
  reviewerInfo: { flex: 1, gap: 3 },
  reviewerName: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  rightHeader: { alignItems: 'flex-end', gap: 4 },
  dateText: { fontSize: 11, color: theme.colors.muted, fontWeight: '500' },
  optionsBtn: { 
    padding: 4, 
    marginRight: -8,
  },
  comment: { fontSize: 13, color: theme.colors.muted, lineHeight: 20, fontStyle: 'italic' },
}));
