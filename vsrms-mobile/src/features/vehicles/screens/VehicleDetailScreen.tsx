import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useVehicle } from '../queries/queries';
import { useUploadVehicleImage } from '../queries/mutations';
import { useVehicleRecords } from '@/features/records/queries/queries';
import { ServiceRecord } from '@/features/records/types/records.types';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { handleApiError } from '@/services/error.handler';

const TYPE_ICON: Record<string, string> = {
  car: 'car-outline',
  motorcycle: 'bicycle-outline',
  tuk: 'car-outline',
  van: 'bus-outline',
  suv: 'car-sport-outline',
  truck: 'car-outline',
  bus: 'bus-outline',
  other: 'construct-outline',
};

export function VehicleDetailScreen({ id }: { id: string }) {
  const router = useRouter();
  const [uploading, setUploading]       = useState(false);
  const [imageError, setImageError]     = useState(false);
  // Optimistic local URI — shown immediately after pick while upload is in flight (Bug C4)
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const { data: vehicle, isLoading: vLoading } = useVehicle(id);
  const { data: recordsData, isLoading: rLoading } = useVehicleRecords(id);
  // useVehicleRecords returns a paginated envelope {data, total, ...} — unwrap the array
  const records: ServiceRecord[] = (recordsData as any)?.data ?? (Array.isArray(recordsData) ? recordsData : []);
  const uploadImage = useUploadVehicleImage();

  const iconName = vehicle?.vehicleType ? (TYPE_ICON[vehicle.vehicleType] ?? 'car-outline') : 'car-outline';

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Allow photo library access to upload a vehicle photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const pickedUri = result.assets[0].uri;
    // Show immediately — don't wait for the upload to complete (Bug C4)
    setLocalImageUri(pickedUri);
    setUploading(true);

    uploadImage.mutate(
      { id, uri: pickedUri },
      {
        onSuccess: () => {
          setImageError(false);
          setLocalImageUri(null); // let the server URL (now in cache) take over
        },
        onSettled: () => setUploading(false),
        onError: (err) => {
          setLocalImageUri(null); // revert on failure
          Alert.alert('Image Upload Failed', handleApiError(err));
        },
      },
    );
  }

  if (vLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F56E0F" />
      </View>
    );
  }

  if (!vehicle) {
    return <ErrorScreen onRetry={() => router.back()} message="Vehicle not found." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── HERO SECTION (Edge-to-Edge) ── */}
      <View style={styles.heroContainer}>
        {/* localImageUri is set immediately on pick (optimistic). Once upload
            completes, the server URL from React Query cache takes over. */}
        {(localImageUri || (vehicle.imageUrl && !imageError)) ? (
          <Image
            source={{ uri: localImageUri ?? vehicle.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
            // 'none' bypasses expo-image disk cache so the new R2 URL is
            // always fetched fresh — fixes the "old photo still showing" issue
            cachePolicy="none"
            onError={() => { if (!localImageUri) setImageError(true); }}
          />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Ionicons name={iconName as any} size={80} color="#D1D5DB" />
          </View>
        )}
        <View style={styles.heroOverlay} />

        {/* Upload overlay */}
        {uploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="large" color="#F56E0F" />
          </View>
        )}

        {/* Change Photo Button */}
        <TouchableOpacity style={styles.changePhotoBtn} onPress={handlePickImage} activeOpacity={0.8}>
          <Ionicons name="camera" size={16} color="#FFFFFF" />
          <Text style={styles.changePhotoText}>{(localImageUri || vehicle.imageUrl) ? 'Change' : 'Add Photo'}</Text>
        </TouchableOpacity>
      </View>

      {/* ── FLOATING HEADER ── */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.glassBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.glassBtn} onPress={() => router.push(`/customer/vehicles/edit/${id}` as any)} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── CONTENT (Overlaps Hero slightly) ── */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={true}>
        
        {/* INFO CARD */}
        <View style={styles.infoCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.infoTextContainer}>
              <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
              <Text style={styles.vehicleReg}>{vehicle.registrationNo}</Text>
            </View>
            <View style={styles.typeBadge}>
              {/* Null-guard: vehicleType may be undefined on older records (Bug C1) */}
              <Text style={styles.typeBadgeText}>{(vehicle.vehicleType ?? 'unknown').toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Year</Text>
              <Text style={styles.metaValue}>{vehicle.year}</Text>
            </View>
            <View style={[styles.metaCell, styles.metaCellBorder]}>
              <Text style={styles.metaLabel}>Mileage</Text>
              <Text style={styles.metaValue}>
                {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'}
              </Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Added</Text>
              <Text style={styles.metaValue}>
                {vehicle.createdAt
                  ? new Date(vehicle.createdAt).toLocaleDateString('en-LK', { month: 'short', year: 'numeric' })
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* SERVICE HISTORY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service History</Text>

          {rLoading ? (
            <ActivityIndicator color="#F56E0F" style={{ marginTop: 20 }} />
          ) : !records || records.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons name="document-text-outline" size={32} color="#D1D5DB" />
              <Text style={styles.emptyHistoryText}>No service records yet</Text>
            </View>
          ) : (
            <View style={styles.timeline}>
              {(records as ServiceRecord[]).map((rec, idx) => (
                <Animated.View key={rec._id} style={styles.timelineItem} entering={FadeInDown.delay(idx * 150).springify().damping(16)}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.timelineDot} />
                    {idx < records.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.historyDate}>
                      {new Date(rec.serviceDate).toLocaleDateString('en-LK', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </Text>
                    <View style={styles.historyCard}>
                      <Text style={styles.historyTitle}>{rec.workDone}</Text>
                      {rec.technicianName && (
                        <View style={styles.techRow}>
                          <Ionicons name="person-outline" size={12} color="#6B7280" />
                          <Text style={styles.historyGarage}>{rec.technicianName}</Text>
                        </View>
                      )}
                      {rec.mileageAtService && (
                        <View style={styles.techRow}>
                          <Ionicons name="speedometer-outline" size={12} color="#6B7280" />
                          <Text style={styles.historyGarage}>{rec.mileageAtService.toLocaleString()} km</Text>
                        </View>
                      )}
                      {rec.partsReplaced && rec.partsReplaced.length > 0 && (
                        <View style={styles.partsWrap}>
                          {rec.partsReplaced.map(p => (
                            <View key={p} style={styles.partChip}>
                              <Text style={styles.partChipText}>{p}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      <View style={styles.costRow}>
                        <Text style={styles.historyCost}>LKR {rec.totalCost.toLocaleString()}</Text>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
  
  heroContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: 320, backgroundColor: '#1A1A2E' },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: { width: '100%', height: '100%', backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(0,0,0,0.5)' }, // simple gradient-like overlay at bottom
  
  uploadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(26,26,46,0.6)', alignItems: 'center', justifyContent: 'center' },

  changePhotoBtn: {
    position: 'absolute', bottom: 40, right: 24,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  changePhotoText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  floatingHeader: { position: 'absolute', top: 56, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 100 },
  glassBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },

  scroll: { paddingTop: 280, paddingHorizontal: 20, paddingBottom: 100 },

  infoCard: { 
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoTextContainer: { flex: 1 },
  vehicleName: { fontSize: 24, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.5 },
  vehicleReg: { fontSize: 13, color: '#6B7280', fontWeight: '800', marginTop: 4, letterSpacing: 0.5, textTransform: 'uppercase' },
  typeBadge: { backgroundColor: '#FFF7ED', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  typeBadgeText: { fontSize: 10, fontWeight: '900', color: '#C2410C' },

  divider: { height: 1.5, backgroundColor: '#F3F4F6', marginVertical: 20 },

  metaGrid: { flexDirection: 'row' },
  metaCell: { flex: 1, paddingHorizontal: 4, alignItems: 'center' },
  metaCellBorder: { borderLeftWidth: 1.5, borderRightWidth: 1.5, borderColor: '#F3F4F6' },
  metaLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  metaValue: { fontSize: 14, color: '#1A1A2E', fontWeight: '700' },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A2E', marginBottom: 20, letterSpacing: -0.3 },

  emptyHistory: { alignItems: 'center', paddingVertical: 40, gap: 12, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB', borderStyle: 'dashed' },
  emptyHistoryText: { fontSize: 14, color: '#9CA3AF', fontWeight: '700' },

  timeline: { paddingLeft: 6 },
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  timelineLeft: { alignItems: 'center', width: 24, marginRight: 16 },
  timelineDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#F56E0F', zIndex: 10, borderWidth: 3, borderColor: '#FFF7ED' },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E5E7EB', marginTop: 4 },

  timelineContent: { flex: 1, marginTop: -4 },
  historyDate: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  historyCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  historyTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
  techRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  historyGarage: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  partsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10, marginBottom: 6 },
  partChip: { backgroundColor: '#F9FAFB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  partChipText: { fontSize: 11, color: '#4B5563', fontWeight: '700' },
  costRow: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', alignItems: 'flex-end' },
  historyCost: { fontSize: 16, fontWeight: '900', color: '#F56E0F' },
}));
