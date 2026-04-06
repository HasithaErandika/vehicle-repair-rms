import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  StyleSheet, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getMyVehicles, deleteVehicle } from '../../api/vehicles';

export default function VehicleListScreen() {
  const router = useRouter();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getMyVehicles();
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

  const handleDelete = (id) => {
    Alert.alert('Delete Vehicle', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteVehicle(id);
            setData((prev) => prev.filter((v) => v._id !== id));
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
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/vehicles/${item._id}`)}
          >
            <Text style={styles.title}>{item.make} {item.model} ({item.year})</Text>
            <Text style={styles.sub}>{item.registrationNo} · {item.vehicleType}</Text>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No vehicles found. Add one!</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/vehicles/add')}>
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
  title:     { fontSize: 16, fontWeight: '600' },
  sub:       { color: '#666', marginTop: 4 },
  deleteBtn: { color: 'red', marginTop: 8 },
  fab:       { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabText:   { color: '#fff', fontSize: 28, lineHeight: 32 },
});
