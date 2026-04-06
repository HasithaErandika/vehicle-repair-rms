import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getWorkshopReviews } from '../../api/reviews';

export default function WorkshopReviewsScreen() {
  const { workshopId } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getWorkshopReviews(workshopId);
        if (mounted) setData(res.data.data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [workshopId]);

  const stars = (rating) => '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

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
            <Text style={styles.user}>{item.userId?.fullName ?? 'User'}</Text>
            {item.reviewText && <Text style={styles.text}>{item.reviewText}</Text>}
            <Text style={styles.date}>{new Date(item.createdAt).toDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No reviews yet. Be the first!</Text>}
      />
      <TouchableOpacity style={styles.btn} onPress={() => router.push(`/reviews/write?workshopId=${workshopId}`)}>
        <Text style={styles.btnTxt}>Write a Review</Text>
      </TouchableOpacity>
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
  user:      { fontWeight: '600', marginTop: 4 },
  text:      { color: '#444', marginTop: 6 },
  date:      { color: '#aaa', fontSize: 12, marginTop: 8 },
  btn:       { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  btnTxt:    { color: '#fff', fontWeight: '600', fontSize: 16 },
});
