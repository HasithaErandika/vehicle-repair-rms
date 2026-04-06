import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createReview } from '../../api/reviews';

export default function WriteReviewScreen() {
  const { workshopId } = useLocalSearchParams();
  const router = useRouter();
  const [rating, setRating]       = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert('Validation', 'Please select a rating from 1 to 5');
      return;
    }
    setLoading(true);
    try {
      await createReview({ workshopId, rating, reviewText });
      Alert.alert('Success', 'Review submitted!');
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Write a Review</Text>
      <Text style={styles.label}>Your Rating</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity key={s} onPress={() => setRating(s)}>
            <Text style={[styles.star, rating >= s && styles.starActive]}>{rating >= s ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Review (optional)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={reviewText}
        onChangeText={setReviewText}
        placeholder="Share your experience..."
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Submit Review</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { padding: 20 },
  title:      { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  label:      { fontWeight: '600', marginBottom: 8, marginTop: 12 },
  stars:      { flexDirection: 'row', gap: 8, marginBottom: 4 },
  star:       { fontSize: 32, color: '#ccc' },
  starActive: { color: '#F4A700' },
  input:      { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  multiline:  { height: 100, textAlignVertical: 'top' },
  btn:        { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 24 },
  btnTxt:     { color: '#fff', fontWeight: '600', fontSize: 16 },
});
