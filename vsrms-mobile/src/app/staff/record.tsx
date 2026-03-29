import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND = '#F56E0F';
const WHITE = '#FFFFFF';
const BG = '#F9FAFB';
const TEXT = '#111827';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';

export default function StaffRecordScreen() {
  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');
  const [parts, setParts] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service Record Entry</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>Vehicle & Job Details</Text>
          
          <View style={styles.jobPreview}>
            <View style={styles.iconBox}>
              <Ionicons name="car-sport" size={24} color={BRAND} />
            </View>
            <View>
              <Text style={styles.jobVehicle}>Toyota Prius (CAA-9876)</Text>
              <Text style={styles.jobType}>Periodic Maintenence (100k km)</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Mileage (km)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. 100,245" 
              value={mileage}
              onChangeText={setMileage}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Technician Notes</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Describe work done, issues found..." 
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Parts Replaced</Text>
              <Text style={styles.switchSub}>Oil filter, Air filter, Brake pads</Text>
            </View>
            <Switch 
              value={parts} 
              onValueChange={setParts}
              trackColor={{ false: '#E5E7EB', true: BRAND }}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Submit Record</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={MUTED} />
          <Text style={styles.infoText}>
            Submitting this record will notify the vehicle owner and update the service history.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: { padding: 20, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: BORDER },
  headerTitle: { fontSize: 22, fontWeight: '900', color: TEXT, letterSpacing: -0.5 },

  scroll: { padding: 20, paddingBottom: 120 },
  formCard: { backgroundColor: WHITE, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: BORDER },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: MUTED, textTransform: 'uppercase', marginBottom: 16 },
  
  jobPreview: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: BORDER },
  iconBox: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#FFF4EC', alignItems: 'center', justifyContent: 'center' },
  jobVehicle: { fontSize: 16, fontWeight: '800', color: TEXT, marginBottom: 2 },
  jobType: { fontSize: 13, color: MUTED, fontWeight: '600' },

  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: TEXT, marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 10, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 16, height: 48, fontSize: 15, color: TEXT },
  textArea: { height: 100, paddingTop: 12, textAlignVertical: 'top' },

  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  switchLabel: { fontSize: 15, fontWeight: '700', color: TEXT, marginBottom: 2 },
  switchSub: { fontSize: 12, color: MUTED, fontWeight: '500' },

  submitBtn: { backgroundColor: BRAND, height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: BRAND, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  submitBtnText: { color: WHITE, fontSize: 16, fontWeight: '800' },

  infoBox: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 12, marginTop: 24, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: 13, color: MUTED, lineHeight: 18, fontWeight: '500' },
});
