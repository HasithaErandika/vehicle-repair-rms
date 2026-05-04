import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  Modal, ScrollView, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import Animated, { FadeInDown, FadeOutDown, FadeIn, FadeOut } from 'react-native-reanimated';

import { Vehicle, VehicleType } from '../types/vehicles.types';
import { useCreateVehicle, useUpdateVehicle, useUploadVehicleImage } from '../queries/mutations';
import { handleApiError } from '@/services/error.handler';
import { useToast } from '@/providers/ToastProvider';

const VEHICLE_TYPES = [
  { value: 'car', label: 'Car', icon: 'car-outline' },
  { value: 'motorcycle', label: 'Motorcycle', icon: 'bicycle-outline' },
  { value: 'tuk', label: 'Tuk Tuk', icon: 'car-outline' },
  { value: 'van', label: 'Van', icon: 'bus-outline' },
  { value: 'suv', label: 'SUV', icon: 'car-sport-outline' },
  { value: 'truck', label: 'Truck', icon: 'car-outline' },
  { value: 'bus', label: 'Bus', icon: 'bus-outline' },
  { value: 'other', label: 'Other', icon: 'construct-outline' },
] as const;

const CURRENT_YEAR = new Date().getFullYear();

interface VehicleFormModalProps {
  visible: boolean;
  onClose: () => void;
  vehicle?: Vehicle; // If provided, we are in Edit mode
}

export function VehicleFormModal({ visible, onClose, vehicle }: VehicleFormModalProps) {
  const isEdit = !!vehicle;
  const { showToast } = useToast();

  const { mutate: createVehicle, isPending: isCreating } = useCreateVehicle();
  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle();
  const uploadImage = useUploadVehicleImage();

  const [form, setForm] = useState({
    registrationNo: '',
    make: '',
    model: '',
    year: '',
    vehicleType: 'car' as VehicleType,
    mileage: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  useEffect(() => {
    if (visible) {
      if (vehicle) {
        setForm({
          registrationNo: vehicle.registrationNo,
          make: vehicle.make,
          model: vehicle.model,
          year: String(vehicle.year),
          vehicleType: vehicle.vehicleType || 'car',
          mileage: vehicle.mileage ? String(vehicle.mileage) : '',
        });
        setImageUri(vehicle.imageUrl || null);
      } else {
        setForm({
          registrationNo: '',
          make: '',
          model: '',
          year: '',
          vehicleType: 'car',
          mileage: '',
        });
        setImageUri(null);
      }
      setErrors({});
    }
  }, [visible, vehicle]);

  const setField = (key: keyof typeof form) => (val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isEdit && !form.registrationNo.trim()) e.registrationNo = 'Required';
    if (!form.make.trim()) e.make = 'Required';
    if (!form.model.trim()) e.model = 'Required';
    const year = parseInt(form.year);
    if (!form.year || isNaN(year)) e.year = 'Invalid';
    else if (year < 1990 || year > CURRENT_YEAR + 1) e.year = 'Invalid year';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Permission required', 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      registrationNo: form.registrationNo.trim().toUpperCase(),
      make: form.make.trim(),
      model: form.model.trim(),
      year: parseInt(form.year),
      vehicleType: form.vehicleType,
      mileage: form.mileage ? parseInt(form.mileage, 10) : undefined,
    };

    if (isEdit) {
      updateVehicle(
        { id: vehicle._id || vehicle.id!, vehicle: payload },
        {
          onSuccess: () => {
            handleImageFlow(vehicle._id || vehicle.id!);
          },
          onError: (err) => showToast(handleApiError(err), 'error'),
        }
      );
    } else {
      createVehicle(payload, {
        onSuccess: (newVehicle) => {
          handleImageFlow(newVehicle._id || (newVehicle as any).id);
        },
        onError: (err) => showToast(handleApiError(err), 'error'),
      });
    }
  };

  const handleImageFlow = (vId: string) => {
    if (!imageUri || (isEdit && imageUri === vehicle?.imageUrl)) {
      showToast(isEdit ? 'Vehicle updated!' : 'Vehicle added!', 'success');
      onClose();
      return;
    }

    setIsUploading(true);
    uploadImage.mutate(
      { id: vId, uri: imageUri, onProgress: (pct) => setUploadPercent(pct) },
      {
        onSuccess: () => showToast('Saved with photo!', 'success'),
        onSettled: () => {
          setIsUploading(false);
          onClose();
        },
        onError: () => showToast('Saved, but photo upload failed', 'error'),
      }
    );
  };

  const isBusy = isCreating || isUpdating || isUploading;

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <Animated.View style={StyleSheet.absoluteFill} entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </BlurView>
      </Animated.View>

      <View style={styles.modalBg}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
          <Animated.View 
            style={styles.modalContent}
            entering={FadeInDown.springify().damping(20).stiffness(200).mass(0.8)}
            exiting={FadeOutDown.duration(200)}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {/* Photo Picker */}
              <TouchableOpacity style={styles.photoBox} onPress={handlePickImage}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.photo} contentFit="cover" />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="camera-outline" size={32} color="#D1D5DB" />
                    <Text style={styles.photoPlaceholderText}>Add Photo</Text>
                  </View>
                )}
                {isUploading && (
                  <View style={styles.uploadOverlay}>
                    <ActivityIndicator color="#F56E0F" />
                    <Text style={styles.uploadText}>{uploadPercent}%</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Vehicle Type */}
              <View style={styles.typeRow}>
                {VEHICLE_TYPES.map(t => (
                  <TouchableOpacity
                    key={t.value}
                    style={[styles.typeBtn, form.vehicleType === t.value && styles.typeBtnActive]}
                    onPress={() => setForm(f => ({ ...f, vehicleType: t.value }))}
                  >
                    <Ionicons name={t.icon as any} size={20} color={form.vehicleType === t.value ? '#F56E0F' : '#9CA3AF'} />
                    <Text style={[styles.typeLabel, form.vehicleType === t.value && styles.typeLabelActive]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.form}>
                {!isEdit && (
                  <Field label="Registration No." value={form.registrationNo} onChange={setField('registrationNo')} placeholder="WP-CAB-1234" error={errors.registrationNo} />
                )}
                <View style={styles.row}>
                  <View style={{ flex: 1 }}><Field label="Make" value={form.make} onChange={setField('make')} placeholder="Toyota" error={errors.make} /></View>
                  <View style={{ flex: 1 }}><Field label="Model" value={form.model} onChange={setField('model')} placeholder="Vitz" error={errors.model} /></View>
                </View>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}><Field label="Year" value={form.year} onChange={setField('year')} placeholder="2018" keyboardType="numeric" error={errors.year} /></View>
                  <View style={{ flex: 1 }}><Field label="Mileage" value={form.mileage} onChange={setField('mileage')} placeholder="45000" keyboardType="numeric" optional /></View>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.submitBtn, isBusy && { opacity: 0.7 }]} 
                onPress={handleSubmit}
                disabled={isBusy}
              >
                {isBusy ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>{isEdit ? 'Update Vehicle' : 'Add Vehicle'}</Text>}
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function Field({ label, value, onChange, placeholder, error, optional, ...rest }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}{optional && <Text style={{ color: '#D1D5DB', textTransform: 'none' }}> (opt)</Text>}</Text>
      <TextInput
        style={[styles.input, error && { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  modalBg: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingTop: 12, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#1A1A2E' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },

  photoBox: { height: 160, borderRadius: 20, backgroundColor: '#F8FAFC', borderWidth: 2, borderColor: '#F1F5F9', borderStyle: 'dashed', overflow: 'hidden', marginBottom: 20 },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  photoPlaceholderText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },
  uploadOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  uploadText: { fontSize: 12, fontWeight: '900', color: '#F56E0F', marginTop: 4 },

  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  typeBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F9FAFB', flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  typeBtnActive: { backgroundColor: '#FFF7ED', borderColor: '#F56E0F' },
  typeLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  typeLabelActive: { color: '#C2410C' },

  form: { gap: 16, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 12 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { height: 50, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, fontSize: 15, color: '#1A1A2E', fontWeight: '600' },

  submitBtn: { height: 56, borderRadius: 16, backgroundColor: '#F56E0F', alignItems: 'center', justifyContent: 'center', shadowColor: '#F56E0F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  submitBtnText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
}));
