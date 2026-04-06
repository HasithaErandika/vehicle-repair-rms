import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getWorkshops } from '../../api/workshops';

export default function WorkshopListScreen() {
  const router = useRouter();
  const [data, setData]         = useState([]);
  const [district, setDistrict] = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const load = async (d = '') => {
    setLoading(true); setError(null);
    try {
      const res = await getWorkshops(d ? { district: d } : {});
      setData(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <TextInput
          style={styles.input}
          placeholder="Filter by district..."
          value={district}
          onChangeText={setDistrict}
          onSubmitEditing={() => load(district)}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={() => load(district)}>
          <Text style={styles.searchBtnTxt}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/workshops/${item._id}`)}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.sub}>{item.district} · ⭐ {item.averageRating.toFixed(1)} ({item.totalReviews})</Text>
              <Text style={styles.sub}>{item.address}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No workshops found.</Text>}
        />
      )}
      <TouchableOpacity style={styles.nearbyBtn} onPress={() => router.push('/workshops/nearby')}>
        <Text style={styles.nearbyBtnTxt}>📍 Find Nearby</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  search:       { flexDirection: 'row', marginBottom: 12, gap: 8 },
  input:        { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  searchBtn:    { backgroundColor: '#007AFF', borderRadius: 8, paddingHorizontal: 14, justifyContent: 'center' },
  searchBtnTxt: { color: '#fff', fontWeight: '600' },
  error:        { color: 'red', padding: 8 },
  empty:        { textAlign: 'center', marginTop: 40, color: '#666' },
  card:         { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, elevation: 2 },
  title:        { fontSize: 16, fontWeight: '600' },
  sub:          { color: '#666', marginTop: 4 },
  nearbyBtn:    { backgroundColor: '#34C759', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  nearbyBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
