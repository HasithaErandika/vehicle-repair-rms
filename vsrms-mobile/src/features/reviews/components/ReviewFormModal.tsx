import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUnistyles } from 'react-native-unistyles';
import { Review } from '../types/reviews.types';

interface ReviewFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
  isSubmitting: boolean;
  initialData?: Review | null;
  workshopName?: string;
}

export function ReviewFormModal({
  visible,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  workshopName,
}: ReviewFormModalProps) {
  const { theme } = useUnistyles();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    if (visible) {
      setRating(initialData?.rating || 0);
      setText(initialData?.reviewText || '');
    }
  }, [visible, initialData]);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, text);
  };

  const handleClose = () => {
    setRating(0);
    setText('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.reviewModalBg}>
        <View style={styles.reviewModalContent}>
          <View style={styles.reviewModalHandle} />
          <View style={styles.reviewModalHeader}>
            <View>
              <Text style={styles.reviewModalTitle}>{initialData ? 'Edit Your Review' : 'Write a Review'}</Text>
              {workshopName && <Text style={styles.reviewModalSub}>{workshopName}</Text>}
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Star picker */}
          <View style={styles.starPicker}>
            {[1, 2, 3, 4, 5].map(i => (
              <TouchableOpacity key={i} onPress={() => setRating(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons
                  name={i <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color={i <= rating ? '#F59E0B' : '#D1D5DB'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.starLabel}>
            {rating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </Text>

          <View style={styles.reviewInputGroup}>
            <Text style={styles.reviewInputLabel}>Your Review (optional)</Text>
            <TextInput
              style={[styles.reviewInput, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface }]}
              placeholder="Share your experience..."
              placeholderTextColor="#9CA3AF"
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.reviewSubmitBtn, { backgroundColor: theme.colors.brand }, (rating === 0 || isSubmitting) && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting
              ? <ActivityIndicator color="#FFF" />
              : <><Ionicons name="send-outline" size={18} color="#FFF" /><Text style={styles.reviewSubmitBtnText}>Submit Review</Text></>
            }
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  reviewModalBg: { flex: 1, backgroundColor: 'rgba(26,26,46,0.7)', justifyContent: 'flex-end' },
  reviewModalContent: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingTop: 12,
  },
  reviewModalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 20 },
  reviewModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  reviewModalTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A2E' },
  reviewModalSub: { fontSize: 13, color: '#6B7280', marginTop: 3, fontWeight: '500' },
  starPicker: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 8 },
  starLabel: { fontSize: 14, fontWeight: '700', color: '#6B7280', textAlign: 'center', marginBottom: 20 },
  reviewInputGroup: { marginBottom: 20 },
  reviewInputLabel: { fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', marginBottom: 8, marginLeft: 2 },
  reviewInput: {
    borderRadius: 14, padding: 14,
    fontSize: 15, minHeight: 100,
    borderWidth: 1.5,
  },
  reviewSubmitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 16, height: 56,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  reviewSubmitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
