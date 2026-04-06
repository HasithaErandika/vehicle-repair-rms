import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { getNearbyWorkshops } from '../../api/workshops';

export default function NearbyWorkshopsScreen() {
  const router = useRouter();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleFind = async () => {
    setLoading(true); setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is needed to find nearby workshops.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const res = await getNearbyWorkshops({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        maxKm: 50,
      });
      setData(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={handleFind} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>📍 Find Workshops Near Me</Text>}
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/workshops/${item._id}`)}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.sub}>{item.district} · ⭐ {item.averageRating.toFixed(1)}</Text>
            <Text style={styles.sub}>{item.address}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading && <Text style={styles.empty}>Tap the button above to search.</Text>}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  btn:       { backgroundColor: '#34C759', borderRadius: 8, padding: 14, alignItems: 'center' },
  btnTxt:    { color: '#fff', fontWeight: '600', fontSize: 16 },
  error:     { color: 'red', marginTop: 8 },
  empty:     { textAlign: 'center', marginTop: 40, color: '#666' },
  card:      { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, elevation: 2 },
  title:     { fontSize: 16, fontWeight: '600' },
  sub:       { color: '#666', marginTop: 4 },
});
