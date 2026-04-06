import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getWorkshop } from '../../api/workshops';

export default function WorkshopDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getWorkshop(id);
        if (mounted) setWorkshop(res.data.workshop);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error)   return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{workshop.name}</Text>
      <Text style={styles.rating}>⭐ {workshop.averageRating.toFixed(1)}  ({workshop.totalReviews} reviews)</Text>
      <Text style={styles.row}>📍 {workshop.address}, {workshop.district}</Text>
      <Text style={styles.row}>📞 {workshop.contactNumber}</Text>
      {workshop.servicesOffered?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Services</Text>
          {workshop.servicesOffered.map((s, i) => <Text key={i} style={styles.service}>• {s}</Text>)}
        </>
      )}
      <TouchableOpacity style={styles.btn} onPress={() => router.push(`/appointments/book?workshopId=${id}&workshopName=${workshop.name}`)}>
        <Text style={styles.btnTxt}>Book Appointment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { backgroundColor: '#666', marginTop: 8 }]} onPress={() => router.push(`/reviews/workshop/${id}`)}>
        <Text style={styles.btnTxt}>View Reviews</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title:        { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  rating:       { fontSize: 16, color: '#F4A700', marginBottom: 12 },
  row:          { fontSize: 15, color: '#444', marginBottom: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  service:      { color: '#555', marginBottom: 4 },
  btn:          { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 24 },
  btnTxt:       { color: '#fff', fontWeight: '600', fontSize: 16 },
  error:        { color: 'red', padding: 16 },
});
