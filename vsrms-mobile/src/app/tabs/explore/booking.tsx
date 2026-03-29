import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const BRAND   = '#FF7300';
const WHITE   = '#FFFFFF';
const BG      = '#F4F5F7';
const CARD    = '#FFFFFF';
const TEXT    = '#111827';
const MUTED   = '#6B7280';
const BORDER  = '#E5E7EB';

const STEPS = ['Vehicle', 'Service', 'Schedule'];

export default function BookingWizardScreen() {
  const router = useRouter();
  const { garageName } = useLocalSearchParams();
  const [step, setStep] = useState(0);

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const vehicles = [
    { id: 'v1', name: 'Honda Civic', plate: 'CBA-1234' },
    { id: 'v2', name: 'Toyota Prius', plate: 'CAA-9876' },
  ];

  const services = [
    { id: 's1', name: 'Full Service', price: 'Rs. 15,000' },
    { id: 's2', name: 'Oil & Filter Change', price: 'Rs. 8,500' },
    { id: 's3', name: 'Brake Check', price: 'Rs. 3,000' },
    { id: 's4', name: 'Wheel Alignment', price: 'Rs. 4,500' },
  ];

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      // Mock success
      alert('Booking Confirmed!');
      router.push('/tabs/appointments');
    }
  };

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={TEXT} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Booking: {garageName || 'Garage'}</Text>
          <Text style={styles.headerStep}>Step {step + 1} of 3: {STEPS[step]}</Text>
        </View>
        <View style={{ width: 20 }} />
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressContainer}>
        {STEPS.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.progressBar, 
              i <= step ? styles.progressBarActive : styles.progressBarInactive
            ]} 
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Which vehicle needs service?</Text>
            {vehicles.map(v => (
              <TouchableOpacity 
                key={v.id} 
                style={[styles.optionCard, selectedVehicle === v.id && styles.optionCardActive]}
                onPress={() => setSelectedVehicle(v.id)}
              >
                <Ionicons name="car-sport" size={24} color={selectedVehicle === v.id ? BRAND : MUTED} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>{v.name}</Text>
                  <Text style={styles.optionSub}>{v.plate}</Text>
                </View>
                {selectedVehicle === v.id && <Ionicons name="checkmark-circle" size={20} color={BRAND} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select services required</Text>
            {services.map(s => (
              <TouchableOpacity 
                key={s.id} 
                style={[styles.optionCard, selectedServices.includes(s.id) && styles.optionCardActive]}
                onPress={() => toggleService(s.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>{s.name}</Text>
                  <Text style={styles.optionSub}>{s.price}</Text>
                </View>
                <Ionicons
                  name={selectedServices.includes(s.id) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={selectedServices.includes(s.id) ? BRAND : BORDER}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pick a convenient time</Text>
            {/* Simple Mock Date Picker */}
            <View style={styles.datePickerPlaceholder}>
              <Text style={styles.placeholderText}>Calendar / Slot Picker UI Placeholder</Text>
              <TouchableOpacity 
                style={[styles.dateSlot, selectedDate === 'tomorrow' && styles.optionCardActive]}
                onPress={() => setSelectedDate('tomorrow')}
              >
                <Text style={styles.optionTitle}>Tomorrow, 10:00 AM</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.dateSlot, selectedDate === 'wednesday' && styles.optionCardActive]}
                onPress={() => setSelectedDate('wednesday')}
              >
                <Text style={styles.optionTitle}>Wednesday, 2:30 PM</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          {step > 0 && (
            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => setStep(step - 1)}
            >
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[
              styles.nextBtn, 
              ((step === 0 && !selectedVehicle) || (step === 1 && selectedServices.length === 0) || (step === 2 && !selectedDate)) && styles.nextBtnDisabled
            ]} 
            onPress={handleNext}
            disabled={(step === 0 && !selectedVehicle) || (step === 1 && selectedServices.length === 0) || (step === 2 && !selectedDate)}
          >
            <Text style={styles.nextBtnText}>{step === 2 ? 'Confirm Booking' : 'Continue'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WHITE },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 13, fontWeight: '600', color: MUTED },
  headerStep: { fontSize: 16, fontWeight: '800', color: TEXT, marginTop: 2 },

  progressContainer: { flexDirection: 'row', gap: 4, paddingHorizontal: 20, marginBottom: 20 },
  progressBar: { flex: 1, height: 4, borderRadius: 2 },
  progressBarActive: { backgroundColor: BRAND },
  progressBarInactive: { backgroundColor: '#F3F4F6' },

  scroll: { paddingHorizontal: 20, paddingBottom: 100 },
  stepContent: { marginTop: 10 },
  stepTitle: { fontSize: 22, fontWeight: '900', color: TEXT, marginBottom: 24, letterSpacing: -0.5 },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  optionCardActive: { borderColor: BRAND, backgroundColor: '#FFF4EC' },
  optionTitle: { fontSize: 16, fontWeight: '700', color: TEXT },
  optionSub: { fontSize: 13, color: MUTED, fontWeight: '500', marginTop: 2 },

  datePickerPlaceholder: { gap: 12 },
  dateSlot: { padding: 20, backgroundColor: WHITE, borderRadius: 16, borderWidth: 1.5, borderColor: '#F3F4F6' },
  placeholderText: { textAlign: 'center', color: MUTED, marginBottom: 12, fontSize: 13, fontWeight: '600' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerRow: { flexDirection: 'row', gap: 12 },
  backBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  backBtnText: { color: TEXT, fontSize: 15, fontWeight: '700' },
  nextBtn: {
    flex: 2,
    backgroundColor: BRAND,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#F3F4F6', opacity: 0.6 },
  nextBtnText: { color: WHITE, fontSize: 15, fontWeight: '800' },
});
