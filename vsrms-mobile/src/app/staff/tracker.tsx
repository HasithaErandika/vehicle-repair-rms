import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

const JOBS = [
  { id: 1, vehicle: 'Toyota Prius', license: 'CAA-9876', status: 'Washing', progress: 0.8, steps: ['Inspection', 'Drain Oil', 'Filter Change', 'Refill', 'Washing'] },
  { id: 2, vehicle: 'Honda Civic', license: 'CBA-1234', status: 'Drain Oil', progress: 0.3, steps: ['Inspection', 'Drain Oil', 'Parts Check', 'Refill'] },
];

export default function StaffTrackerScreen() {
  const { theme } = useUnistyles();

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
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
                        {isDone && !isCurrent && <Ionicons name="checkmark" size={12} color={theme.colors.surface} />}
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
              <Text style={styles.updateBtnText}>Next Step: Finish {j.status}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: { 
    padding: theme.spacing.md, 
    backgroundColor: theme.colors.surface, 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border 
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },

  scroll: { padding: theme.spacing.md, paddingBottom: 120 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 4,
    shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  vehicleName: { fontSize: 19, fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  license: { fontSize: 13, color: theme.colors.muted, fontWeight: '700', letterSpacing: 1 },
  progressCircle: { 
    width: 48, height: 48, borderRadius: 24, 
    backgroundColor: theme.colors.brandSoft, 
    alignItems: 'center', justifyContent: 'center', 
    borderWidth: 2, borderColor: theme.colors.brand 
  },
  progressText: { fontSize: 13, fontWeight: '800', color: theme.colors.brand },

  trackContainer: { marginBottom: 24, paddingLeft: 10 },
  stepRow: { flexDirection: 'row', gap: 16, height: 45, alignItems: 'flex-start' },
  lineCol: { alignItems: 'center', width: 24 },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.border, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  dotDone: { backgroundColor: '#10B981' },
  dotCurrent: {
    backgroundColor: theme.colors.brand,
    borderWidth: 4,
    borderColor: theme.colors.brandSoft
  },
  line: { width: 2, height: 45, backgroundColor: theme.colors.border, position: 'absolute', top: 12, zIndex: 1 },
  lineDone: { backgroundColor: '#10B981' },
  stepText: { fontSize: 15, fontWeight: '600', color: theme.colors.muted, marginTop: 2 },
  stepTextDone: { color: theme.colors.text, fontWeight: '700' },
  stepTextCurrent: { color: theme.colors.brand, fontWeight: '900' },

  updateBtn: { backgroundColor: theme.colors.text, height: 48, borderRadius: theme.radii.md, alignItems: 'center', justifyContent: 'center' },
  updateBtnText: { color: theme.colors.surface, fontSize: 14, fontWeight: '800' }
}));
