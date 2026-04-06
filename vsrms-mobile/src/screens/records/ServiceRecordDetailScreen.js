import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getRecord } from '../../api/records';

export default function ServiceRecordDetailScreen() {
  const { id } = useLocalSearchParams();
  const [record, setRecord]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getRecord(id);
        if (mounted) setRecord(res.data.record);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Service Record</Text>
      <Text style={styles.label}>Date</Text>
      <Text style={styles.value}>{new Date(record.serviceDate).toDateString()}</Text>
      <Text style={styles.label}>Work Done</Text>
      <Text style={styles.value}>{record.workDone}</Text>
      <Text style={styles.label}>Total Cost</Text>
      <Text style={styles.value}>LKR {record.totalCost.toLocaleString()}</Text>
      {record.mileageAtService != null && (
        <><Text style={styles.label}>Mileage</Text><Text style={styles.value}>{record.mileageAtService} km</Text></>
      )}
      {record.technicianName && (
        <><Text style={styles.label}>Technician</Text><Text style={styles.value}>{record.technicianName}</Text></>
      )}
      {record.partsReplaced?.length > 0 && (
        <>
          <Text style={styles.label}>Parts Replaced</Text>
          {record.partsReplaced.map((p, i) => <Text key={i} style={styles.value}>• {p}</Text>)}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title:     { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  label:     { fontWeight: '600', color: '#888', marginTop: 12, fontSize: 13, textTransform: 'uppercase' },
  value:     { fontSize: 16, color: '#333', marginTop: 2 },
  error:     { color: 'red', padding: 16 },
});
