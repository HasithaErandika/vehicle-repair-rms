import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getReview, updateReview } from '../../api/reviews';

export default function EditReviewScreen() {
  const { id }    = useLocalSearchParams();
  const router    = useRouter();
  const [rating, setRating]         = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getReview(id);
        if (mounted) {
          setRating(res.data.review.rating);
          setReviewText(res.data.review.reviewText ?? '');
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [id]);

  const handleSave = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert('Validation', 'Please select a rating from 1 to 5');
      return;
    }
    setSaving(true);
    try {
      await updateReview(id, { rating, reviewText });
      Alert.alert('Saved', 'Your review has been updated.');
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error)   return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Review</Text>
      <Text style={styles.label}>Your Rating</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity key={s} onPress={() => setRating(s)}>
            <Text style={[styles.star, rating >= s && styles.starActive]}>{rating >= s ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Review</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={reviewText}
        onChangeText={setReviewText}
        placeholder="Share your experience..."
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Save Changes</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { padding: 20 },
  title:      { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  label:      { fontWeight: '600', marginBottom: 8, marginTop: 12 },
  stars:      { flexDirection: 'row', gap: 8 },
  star:       { fontSize: 32, color: '#ccc' },
  starActive: { color: '#F4A700' },
  input:      { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  multiline:  { height: 100, textAlignVertical: 'top' },
  btn:        { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 24 },
  btnTxt:     { color: '#fff', fontWeight: '600', fontSize: 16 },
  error:      { color: 'red', padding: 16 },
});
