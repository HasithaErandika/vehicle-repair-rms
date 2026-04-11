import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

export default function JobTrackerScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();

  const jobs = [
    { id: 'j1', vehicle: 'Honda Civic', license: 'CBA-1234', status: 'In Progress', progress: 0.6, technician: 'Amal P.' },
    { id: 'j2', vehicle: 'Toyota Prius', license: 'CAA-9876', status: 'Waiting for Parts', progress: 0.2, technician: 'Bandara K.' },
    { id: 'j3', vehicle: 'Nissan Leaf', license: 'CAD-1122', status: 'Ready for Pickup', progress: 1.0, technician: 'Amal P.' },
  ];

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Status Tracker</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {jobs.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.vehicleTitle}>{job.vehicle}</Text>
                <Text style={styles.licenseText}>{job.license}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                job.status === 'Ready for Pickup' ? styles.statusSuccess : (job.status === 'In Progress' ? styles.statusInfo : styles.statusWarning)
              ]}>
                <Text style={[
                  styles.statusText,
                  job.status === 'Ready for Pickup' ? styles.statusTextSuccess : (job.status === 'In Progress' ? styles.statusTextInfo : styles.statusTextWarning)
                ]}>{job.status}</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: `${job.progress * 100}%`, backgroundColor: job.status === 'Ready for Pickup' ? theme.colors.successText : theme.colors.brand }]} />
              </View>
              <Text style={styles.progressPercent}>{Math.round(job.progress * 100)}% Complete</Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.techBox}>
                <Ionicons name="person-outline" size={14} color={theme.colors.muted} />
                <Text style={styles.techText}>Technician: {job.technician}</Text>
              </View>
              <TouchableOpacity style={styles.updateBtn}>
                <Text style={styles.updateText}>Update Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  backBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    alignItems: 'center', justifyContent: 'center', 
    backgroundColor: theme.colors.background 
  },
  filterBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    alignItems: 'center', justifyContent: 'center', 
    borderWidth: 1, borderColor: theme.colors.border 
  },

  scroll: { padding: theme.spacing.md, paddingBottom: 100 },
  
  jobCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  vehicleTitle: { fontSize: 17, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.3 },
  licenseText: { fontSize: 13, color: theme.colors.muted, fontWeight: '600', marginTop: 2 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  statusSuccess: { backgroundColor: theme.colors.successBackground },
  statusInfo: { backgroundColor: theme.colors.brandSoft },
  statusWarning: { backgroundColor: theme.colors.warningBackground },
  
  statusText: { fontSize: 11, fontWeight: '800' },
  statusTextSuccess: { color: theme.colors.successText },
  statusTextInfo: { color: theme.colors.brand },
  statusTextWarning: { color: theme.colors.warningText },

  progressSection: { marginBottom: 20 },
  progressTrack: { height: 8, backgroundColor: theme.colors.background, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressBar: { height: '100%' },
  progressPercent: { fontSize: 12, fontWeight: '700', color: theme.colors.muted, textAlign: 'right' },

  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: theme.colors.border, 
    paddingTop: 16 
  },
  techBox: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  techText: { fontSize: 13, color: theme.colors.muted, fontWeight: '500' },
  updateBtn: { 
    backgroundColor: theme.colors.background, 
    paddingHorizontal: 12, paddingVertical: 8, 
    borderRadius: 8, borderWidth: 1, 
    borderColor: theme.colors.border 
  },
  updateText: { fontSize: 12, fontWeight: '700', color: theme.colors.text }
}));
