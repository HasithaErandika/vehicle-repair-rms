import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getMyAppointments } from '../../api/appointments';

const STATUS_COLORS = {
  pending:     '#F4A700',
  confirmed:   '#007AFF',
  in_progress: '#AF52DE',
  completed:   '#34C759',
  cancelled:   '#FF3B30',
};

export default function AppointmentListScreen() {
  const router = useRouter();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getMyAppointments();
        if (mounted) setData(res.data.data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (error)   return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/appointments/${item._id}`)}>
            <View style={styles.row}>
              <Text style={styles.service}>{item.serviceType}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] }]}>
                <Text style={styles.badgeTxt}>{item.status.replace('_', ' ')}</Text>
              </View>
            </View>
            <Text style={styles.sub}>{new Date(item.scheduledDate).toDateString()}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No appointments yet.</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/appointments/book')}>
        <Text style={styles.fabText}>+</Text>
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
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  service:   { fontSize: 16, fontWeight: '600' },
  sub:       { color: '#666', marginTop: 4 },
  badge:     { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  badgeTxt:  { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  fab:       { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabText:   { color: '#fff', fontSize: 28, lineHeight: 32 },
});
