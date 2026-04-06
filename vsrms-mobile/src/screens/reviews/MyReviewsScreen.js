import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getMyReviews, deleteReview } from '../../api/reviews';

export default function MyReviewsScreen() {
  const router = useRouter();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getMyReviews();
      setData(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stars = (n) => '⭐'.repeat(n) + '☆'.repeat(5 - n);

  const handleDelete = (id, workshopId) => {
    Alert.alert('Delete Review', 'Are you sure you want to delete this review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteReview(id);
            setData((prev) => prev.filter((r) => r._id !== id));
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (error)   return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.stars}>{stars(item.rating)}</Text>
            {item.reviewText ? <Text style={styles.text}>{item.reviewText}</Text> : null}
            <Text style={styles.date}>{new Date(item.createdAt).toDateString()}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => router.push(`/reviews/${item._id}/edit`)}>
                <Text style={styles.editBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>You haven't written any reviews yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error:     { color: 'red', padding: 16 },
  empty:     { textAlign: 'center', marginTop: 40, color: '#666' },
  card:      { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, elevation: 2 },
  stars:     { fontSize: 18 },
  text:      { color: '#444', marginTop: 6 },
  date:      { color: '#aaa', fontSize: 12, marginTop: 8 },
  actions:   { flexDirection: 'row', gap: 16, marginTop: 10 },
  editBtn:   { color: '#007AFF', fontWeight: '600' },
  deleteBtn: { color: '#FF3B30', fontWeight: '600' },
});
