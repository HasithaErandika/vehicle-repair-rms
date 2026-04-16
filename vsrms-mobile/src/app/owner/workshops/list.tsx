import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, TextInput,
  ActivityIndicator, StatusBar, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { useMyWorkshops } from '@/features/workshops/queries/queries';
import { useCreateWorkshop } from '@/features/workshops/queries/mutations';
import { Workshop } from '@/features/workshops/types/workshops.types';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { AvatarMenu } from '@/components/ui/AvatarMenu';

const DEFAULT_COORD = { lat: 6.9271, lng: 79.8612 };

// ── Location picker modal ─────────────────────────────────────────────────────

interface LocationPickerProps {
  visible: boolean;
  initial: { lat: number; lng: number };
  onConfirm: (coord: { lat: number; lng: number }) => void;
  onCancel: () => void;
}

function LocationPickerModal({ visible, initial, onConfirm, onCancel }: LocationPickerProps) {
  const [coord, setCoord] = useState(initial);
  const [locating, setLocating] = useState(false);

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCoord({ lat: latitude, lng: longitude });
  };

  const handleUseMyLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setCoord({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    } finally {
      setLocating(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={pickerStyles.container}>
        <View style={pickerStyles.header}>
          <TouchableOpacity onPress={onCancel} style={pickerStyles.headerBtn}>
            <Ionicons name="close" size={22} color="#1A1A2E" />
          </TouchableOpacity>
          <Text style={pickerStyles.headerTitle}>Pick Workshop Location</Text>
          <TouchableOpacity onPress={handleUseMyLocation} style={pickerStyles.headerBtn} disabled={locating}>
            {locating ? <ActivityIndicator size="small" color="#F56E0F" /> : <Ionicons name="locate" size={22} color="#F56E0F" />}
          </TouchableOpacity>
        </View>

        <View style={pickerStyles.hint}>
          <Ionicons name="information-circle-outline" size={14} color="#6B7280" />
          <Text style={pickerStyles.hintText}>Tap the map or drag the pin to place your workshop</Text>
        </View>

        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={{ flex: 1 }}
          initialRegion={{ latitude: initial.lat, longitude: initial.lng, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          onPress={handleMapPress}
          showsUserLocation
          showsMyLocationButton={false}
          toolbarEnabled={false}
        >
          <Marker
            coordinate={{ latitude: coord.lat, longitude: coord.lng }}
            draggable
            onDragEnd={e => { const { latitude, longitude } = e.nativeEvent.coordinate; setCoord({ lat: latitude, lng: longitude }); }}
          />
        </MapView>

        <View style={pickerStyles.bottomPanel}>
          <View style={pickerStyles.coordRow}>
            <Ionicons name="location" size={16} color="#F56E0F" />
            <Text style={pickerStyles.coordText}>{coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}</Text>
          </View>
          <TouchableOpacity style={pickerStyles.confirmBtn} onPress={() => onConfirm(coord)}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={pickerStyles.confirmBtnText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Workshop card ─────────────────────────────────────────────────────────────

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const router = useRouter();
  const isActive = workshop.active !== false;
  return (
    <TouchableOpacity
      style={[styles.card, !isActive && styles.cardInactive]}
      activeOpacity={0.8}
      onPress={() => router.push(`/owner/workshops/${workshop._id ?? workshop.id}` as any)}
    >
      <View style={styles.cardRow}>
        <View style={[styles.cardIcon, !isActive && { backgroundColor: '#F3F4F6' }]}>
          <Ionicons name="business" size={22} color={isActive ? '#F56E0F' : '#9CA3AF'} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardName} numberOfLines={1}>{workshop.name}</Text>
          <Text style={styles.cardAddress} numberOfLines={1}>{workshop.address}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerChip}>
          <Ionicons name="location-outline" size={12} color="#6B7280" />
          <Text style={styles.footerChipText}>{workshop.district}</Text>
        </View>
        <View style={styles.footerChip}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={styles.footerChipText}>{(workshop.averageRating ?? 0).toFixed(1)} ({workshop.totalReviews ?? 0})</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isActive ? '#ECFDF5' : '#F3F4F6' }]}>
          <View style={[styles.statusDot, { backgroundColor: isActive ? '#10B981' : '#9CA3AF' }]} />
          <Text style={[styles.statusText, { color: isActive ? '#059669' : '#6B7280' }]}>
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function OwnerDashboardScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const displayName = user?.fullName ?? user?.email ?? 'Owner';
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  const { data: workshops = [], isLoading, isError, refetch } = useMyWorkshops();
  const { mutate: create, isPending: creating } = useCreateWorkshop();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [pickedCoord, setPickedCoord] = useState(DEFAULT_COORD);
  const [formData, setFormData] = useState({
    name: '', address: '', contactNumber: '', district: 'Colombo', description: '', servicesOffered: '',
  });

  const handleCreate = () => {
    if (!formData.name || !formData.address || !formData.contactNumber) return;
    create(
      {
        name: formData.name,
        address: formData.address,
        contactNumber: formData.contactNumber,
        district: formData.district,
        description: formData.description || undefined,
        servicesOffered: formData.servicesOffered
          ? formData.servicesOffered.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        location: { type: 'Point', coordinates: [pickedCoord.lng, pickedCoord.lat] },
      },
      {
        onSuccess: () => {
          setCreateModalVisible(false);
          setFormData({ name: '', address: '', contactNumber: '', district: 'Colombo', description: '', servicesOffered: '' });
          setPickedCoord(DEFAULT_COORD);
        },
      },
    );
  };

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── Dark header ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSub}>My Business</Text>
            <Text style={styles.headerTitle}>Workshops</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setCreateModalVisible(true)} activeOpacity={0.8}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <AvatarMenu
            initials={initials}
            onSettings={() => router.push('/owner/settings' as any)}
            onSignOut={signOut}
          />
        </View>

        {/* Summary strip */}
        {!isLoading && (
          <View style={styles.summaryStrip}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{workshops.length}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{workshops.filter(w => w.active !== false).length}</Text>
              <Text style={styles.summaryLabel}>Active</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {workshops.reduce((sum, w) => sum + (w.totalReviews ?? 0), 0)}
              </Text>
              <Text style={styles.summaryLabel}>Reviews</Text>
            </View>
          </View>
        )}

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── White card ── */}
      <View style={[styles.mainCard, { overflow: 'hidden' }]}>
        {isLoading ? (
          <View style={styles.centered}><ActivityIndicator size="large" color="#F56E0F" /></View>
        ) : isError ? (
          <ErrorScreen onRetry={refetch} variant="inline" />
        ) : (workshops || []).length === 0 ? (
          <ScrollView contentContainerStyle={styles.emptyScroll}>
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="business-outline" size={48} color="#F56E0F" />
              </View>
              <Text style={styles.emptyTitle}>No workshops yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first workshop to start managing bookings, staff, and service records.
              </Text>
              <TouchableOpacity style={styles.emptyCreateBtn} onPress={() => setCreateModalVisible(true)}>
                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                <Text style={styles.emptyCreateBtnText}>Create Workshop</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            <Text style={styles.listHeader}>
              Tap a workshop to manage bookings, staff, and records
            </Text>
            {(workshops || []).map(w => (
              <WorkshopCard key={w._id ?? w.id} workshop={w} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* ── Create workshop modal ── */}
      <Modal visible={createModalVisible} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Workshop</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {[
                { key: 'name', label: 'Workshop Name *', placeholder: 'e.g. Master Motors' },
                { key: 'address', label: 'Full Address *', placeholder: 'Street, City' },
                { key: 'contactNumber', label: 'Contact Number *', placeholder: '+94 XX XXX XXXX' },
                { key: 'district', label: 'District *', placeholder: 'Colombo' },
              ].map(f => (
                <View key={f.key} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{f.label}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={f.placeholder}
                    value={(formData as any)[f.key]}
                    onChangeText={t => setFormData(fd => ({ ...fd, [f.key]: t }))}
                    keyboardType={f.key === 'contactNumber' ? 'phone-pad' : 'default'}
                  />
                </View>
              ))}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description (optional)</Text>
                <TextInput style={[styles.input, { height: 72 }]} placeholder="Brief description…" multiline textAlignVertical="top" value={formData.description} onChangeText={t => setFormData(f => ({ ...f, description: t }))} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Services (comma-separated)</Text>
                <TextInput style={styles.input} placeholder="Oil Change, Brake Service" value={formData.servicesOffered} onChangeText={t => setFormData(f => ({ ...f, servicesOffered: t }))} />
              </View>

              {/* Map location picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location *</Text>
                <TouchableOpacity style={styles.locationPickerBtn} onPress={() => setLocationPickerVisible(true)} activeOpacity={0.75}>
                  <View style={styles.locationPickerIcon}>
                    <Ionicons name="map" size={18} color="#F56E0F" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.locationPickerLabel}>Workshop Pin</Text>
                    <Text style={styles.locationPickerCoord}>{pickedCoord.lat.toFixed(5)}, {pickedCoord.lng.toFixed(5)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveBtn, creating && { opacity: 0.7 }]}
              onPress={handleCreate}
              disabled={creating}
            >
              {creating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Create Workshop</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Map location picker */}
      <LocationPickerModal
        visible={locationPickerVisible}
        initial={pickedCoord}
        onConfirm={coord => { setPickedCoord(coord); setLocationPickerVisible(false); }}
        onCancel={() => setLocationPickerVisible(false)}
      />
    </ScreenWrapper>
  );
}

// ─── Picker styles ────────────────────────────────────────────────────────────

const pickerStyles = StyleSheet.create(() => ({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A2E' },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F9FAFB' },
  hintText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  bottomPanel: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 12 },
  coordRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF7ED', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#FED7AA' },
  coordText: { fontSize: 13, fontWeight: '700', color: '#9A3412' },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F56E0F', borderRadius: 16, height: 54, shadowColor: '#F56E0F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  confirmBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
}));

// ─── Main styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create((theme) => ({
  topSection: { paddingHorizontal: theme.spacing.screenPadding, paddingTop: 16, paddingBottom: 60, position: 'relative', overflow: 'hidden', backgroundColor: '#1A1A2E' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 10, marginBottom: 24, marginTop: 12 },
  headerSub: { fontSize: theme.fonts.sizes.caption, color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  headerTitle: { fontSize: theme.fonts.sizes.pageTitle, color: '#FFFFFF', fontWeight: '900', letterSpacing: -0.5, marginTop: 4 },
  addBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F56E0F', alignItems: 'center', justifyContent: 'center', shadowColor: '#F56E0F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },

  summaryStrip: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 8, zIndex: 10, marginBottom: 4 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  summaryLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },

  decCircle1: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(245,110,15,0.12)', top: -30, right: -20 },
  decCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(245,110,15,0.06)', bottom: 10, right: 90 },

  mainCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: theme.spacing.cardOverlap, flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  list: { paddingHorizontal: theme.spacing.screenPadding, paddingTop: 20, paddingBottom: 130 },
  listHeader: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', textAlign: 'center', marginBottom: 16 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardInactive: { opacity: 0.6 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardIcon: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' },
  cardName: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  cardAddress: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  footerChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F9FAFB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  footerChipText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 'auto' },
  statusDot: { width: 5, height: 5, borderRadius: 2.5 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  emptyScroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32 },
  emptyState: { alignItems: 'center', gap: 12 },
  emptyIcon: { width: 88, height: 88, borderRadius: 28, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FED7AA', marginBottom: 4 },
  emptyTitle: { fontSize: 22, fontWeight: '900', color: '#1A1A2E' },
  emptySubtitle: { fontSize: 14, color: '#6B7280', fontWeight: '500', textAlign: 'center', lineHeight: 22 },
  emptyCreateBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F56E0F', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, marginTop: 8, shadowColor: '#F56E0F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  emptyCreateBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },

  // Create modal
  modalBg: { flex: 1, backgroundColor: 'rgba(26,26,46,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A2E' },
  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', marginBottom: 6, marginLeft: 2 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 12, height: 48, paddingHorizontal: 14, fontSize: 15, color: '#1A1A2E', borderWidth: 1, borderColor: '#E5E7EB' },
  locationPickerBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  locationPickerIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' },
  locationPickerLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginBottom: 2 },
  locationPickerCoord: { fontSize: 13, fontWeight: '700', color: '#1A1A2E' },
  saveBtn: { backgroundColor: '#F56E0F', borderRadius: 14, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 12, shadowColor: '#F56E0F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
}));
