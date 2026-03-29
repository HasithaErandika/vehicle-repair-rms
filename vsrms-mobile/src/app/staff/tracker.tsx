import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND = '#F56E0F';
const WHITE = '#FFFFFF';
const BG = '#F9FAFB';
const TEXT = '#111827';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';

const JOBS = [
  { id: 1, vehicle: 'Toyota Prius', license: 'CAA-9876', status: 'Washing', progress: 0.8, steps: ['Inspection', 'Drain Oil', 'Filter Change', 'Refill', 'Washing'] },
  { id: 2, vehicle: 'Honda Civic', license: 'CBA-1234', status: 'Drain Oil', progress: 0.3, steps: ['Inspection', 'Drain Oil', 'Parts Check', 'Refill'] },
];

export default function StaffTrackerScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Status Tracker</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {JOBS.map(j => (
          <View key={j.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.vehicleName}>{j.vehicle}</Text>
                <Text style={styles.license}>{j.license}</Text>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>{Math.round(j.progress * 100)}%</Text>
              </View>
            </View>

            <View style={styles.trackContainer}>
              {j.steps.map((step, i) => {
                const isDone = j.steps.indexOf(j.status) >= i;
                const isCurrent = step === j.status;
                return (
                  <View key={step} style={styles.stepRow}>
                    <View style={styles.lineCol}>
                      <View style={[styles.dot, isDone && styles.dotDone, isCurrent && styles.dotCurrent]}>
                        {isDone && !isCurrent && <Ionicons name="checkmark" size={12} color={WHITE} />}
                      </View>
                      {i < j.steps.length - 1 && <View style={[styles.line, isDone && styles.lineDone]} />}
                    </View>
                    <Text style={[styles.stepText, isDone && styles.stepTextDone, isCurrent && styles.stepTextCurrent]}>
                      {step}
                    </Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity style={styles.updateBtn}>
              <Text style={styles.updateBtnText}>Next Step: Finish Washing</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: { padding: 20, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: BORDER },
  headerTitle: { fontSize: 24, fontWeight: '900', color: TEXT, letterSpacing: -0.5 },

  scroll: { padding: 20, paddingBottom: 120 },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER,
    elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  vehicleName: { fontSize: 19, fontWeight: '800', color: TEXT, marginBottom: 4 },
  license: { fontSize: 13, color: MUTED, fontWeight: '700', letterSpacing: 1 },
  progressCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF4EC', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: BRAND },
  progressText: { fontSize: 13, fontWeight: '800', color: BRAND },

  trackContainer: { marginBottom: 24, paddingLeft: 10 },
  stepRow: { flexDirection: 'row', gap: 16, height: 45, alignItems: 'flex-start' },
  lineCol: { alignItems: 'center', width: 24 },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  dotDone: { backgroundColor: '#10B981' },
  dotCurrent: { backgroundColor: BRAND, borderWidth: 4, borderColor: '#FFF4EC' },
  line: { width: 2, height: 45, backgroundColor: '#E5E7EB', position: 'absolute', top: 12, zIndex: 1 },
  lineDone: { backgroundColor: '#10B981' },
  stepText: { fontSize: 15, fontWeight: '600', color: MUTED, marginTop: 2 },
  stepTextDone: { color: TEXT, fontWeight: '700' },
  stepTextCurrent: { color: BRAND, fontWeight: '900' },

  updateBtn: { backgroundColor: '#111827', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  updateBtnText: { color: WHITE, fontSize: 14, fontWeight: '800' },
});
