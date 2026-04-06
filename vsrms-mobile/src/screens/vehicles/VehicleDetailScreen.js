import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ActivityIndicator, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getVehicle, uploadVehicleImage } from '../../api/vehicles';

export default function VehicleDetailScreen() {
  const { id }    = useLocalSearchParams();
  const router    = useRouter();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getVehicle(id);
        if (mounted) setVehicle(res.data.vehicle);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [id]);

  const handleUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera roll access is needed to upload photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled) return;
    try {
      const asset = result.assets[0];
      const formData = new FormData();
      formData.append('image', { uri: asset.uri, name: asset.fileName ?? 'photo.jpg', type: asset.mimeType ?? 'image/jpeg' });
      const res = await uploadVehicleImage(id, formData);
      setVehicle((v) => ({ ...v, imageUrl: res.data.imageUrl }));
    } catch (err) {
      Alert.alert('Upload failed', err.message);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (error)   return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      {vehicle.imageUrl
        ? <Image source={{ uri: vehicle.imageUrl }} style={styles.image} />
        : <TouchableOpacity style={styles.imagePlaceholder} onPress={handleUpload}>
            <Text style={styles.uploadTxt}>Tap to upload photo</Text>
          </TouchableOpacity>
      }
      <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
      <Text style={styles.row}>Year: {vehicle.year}</Text>
      <Text style={styles.row}>Type: {vehicle.vehicleType}</Text>
      <Text style={styles.row}>Reg: {vehicle.registrationNo}</Text>
      {vehicle.mileage != null && <Text style={styles.row}>Mileage: {vehicle.mileage} km</Text>}
      <TouchableOpacity style={styles.btn} onPress={() => router.push(`/vehicles/${id}/edit`)}>
        <Text style={styles.btnTxt}>Edit Vehicle</Text>
      </TouchableOpacity>
      {vehicle.imageUrl && (
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#555', marginTop: 8 }]} onPress={handleUpload}>
          <Text style={styles.btnTxt}>Change Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  center:           { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error:            { color: 'red', padding: 16 },
  image:            { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  imagePlaceholder: { width: '100%', height: 180, backgroundColor: '#ddd', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  uploadTxt:        { color: '#666' },
  title:            { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  row:              { fontSize: 16, marginBottom: 6, color: '#444' },
  btn:              { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 20 },
  btnTxt:           { color: '#fff', fontWeight: '600', fontSize: 16 },
});
