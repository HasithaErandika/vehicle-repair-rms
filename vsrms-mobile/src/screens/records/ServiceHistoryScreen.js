import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRecordsByVehicle } from '../../api/records';

export default function ServiceHistoryScreen() {
  const { vehicleId } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getRecordsByVehicle(vehicleId);
        if (mounted) setData(res.data.data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [vehicleId]);

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (error)   return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/records/${item._id}`)}>
            <Text style={styles.title}>{item.workDone}</Text>
            <Text style={styles.sub}>{new Date(item.serviceDate).toDateString()}</Text>
            <Text style={styles.cost}>LKR {item.totalCost.toLocaleString()}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No service records yet.</Text>}
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
  title:     { fontSize: 15, fontWeight: '600' },
  sub:       { color: '#666', marginTop: 4 },
  cost:      { color: '#007AFF', fontWeight: '600', marginTop: 4 },
});
