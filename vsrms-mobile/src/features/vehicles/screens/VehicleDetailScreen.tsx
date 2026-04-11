import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Car, ChevronLeft, Download } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useVehicle } from '../queries/queries';

export function VehicleDetailScreen({ id }: { id: string }) {
  const router = useRouter();
  const { theme } = useUnistyles();

  // Fetch single vehicle data
  const { data: vehicleData } = useVehicle(id);

  const vehicle = vehicleData || {
    make: 'Honda',
    model: 'Civic',
    year: '2020',
    registrationNo: 'CBA-1234',
    vin: '1HGCM82633A004',
    status: 'Active',
    mileage: '45,200 km',
  };

  const history = [
    {
      id: 'r1',
      date: 'Oct 12, 2024',
      title: 'Full Service & Oil Change',
      garage: 'AutoCare Garage Colombo',
      cost: 'LKR 15,000',
    },
    {
      id: 'r2',
      date: 'May 04, 2024',
      title: 'Brake Pad Replacement',
      garage: 'QuickFix Auto',
      cost: 'LKR 8,500',
    },
  ];

  const isActive = vehicle.status === 'Active';

  return (
    <ScreenWrapper bg="background">
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Details</Text>
        <View style={styles.placeholderBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* VEHICLE INFO CARD */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Car size={28} color={theme.colors.text} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>{vehicle.make} {vehicle.model}</Text>
              <Text style={styles.infoLicense}>{vehicle.registrationNo}</Text>
            </View>
            <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusWarning]}>
              <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextWarning]}>
                {vehicle.status}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Year</Text>
              <Text style={styles.metaValue}>{vehicle.year}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Mileage</Text>
              <Text style={styles.metaValue}>{vehicle.mileage || 'N/A'}</Text>
            </View>
            <View style={[styles.metaCell, styles.noBorder]}>
              <Text style={styles.metaLabel}>VIN</Text>
              <Text style={styles.metaValue} numberOfLines={1}>{vehicle.vin || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* SERVICE HISTORY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Service History</Text>
            <TouchableOpacity activeOpacity={0.7} style={styles.linkRow}>
              <Download size={16} color={theme.colors.brand} />
              <Text style={styles.linkText}>PDF</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeline}>
            {history.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineDot} />
                  {index !== history.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <View style={styles.historyCard}>
                    <Text style={styles.historyTitle}>{item.title}</Text>
                    <Text style={styles.historyGarage}>{item.garage}</Text>
                    <View style={styles.historyDivider} />
                    <Text style={styles.historyCost}>{item.cost}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

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
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: theme.radii.full, backgroundColor: theme.colors.background,
  },
  headerTitle: { fontSize: theme.fonts.sizes.lg, fontWeight: '800', color: theme.colors.text },
  placeholderBtn: { width: 40 },
  scroll: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    boxShadow: [{
      offsetX: 0,
      offsetY: 2,
      blurRadius: 8,
      color: 'rgba(0, 0, 0, 0.04)',
    }],
    elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 54, height: 54, borderRadius: theme.radii.md, backgroundColor: theme.colors.background,
    alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md,
  },
  infoTextContainer: { flex: 1 },
  infoTitle: { fontSize: theme.fonts.sizes.xl, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5, marginBottom: 2 },
  infoLicense: { fontSize: theme.fonts.sizes.sm, color: theme.colors.muted, fontWeight: '600' },
  
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radii.md,
  },
  statusActive: {
    backgroundColor: theme.colors.successBackground,
  },
  statusWarning: {
    backgroundColor: theme.colors.warningBackground,
  },
  statusText: { fontSize: 11, fontWeight: '800' },
  statusTextActive: {
    color: theme.colors.successText,
  },
  statusTextWarning: {
    color: theme.colors.warningText,
  },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing.lg },

  metaGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  metaCell: { flex: 1, borderRightWidth: 1, borderRightColor: theme.colors.border, paddingHorizontal: 4 },
  noBorder: { borderRightWidth: 0 },
  metaLabel: { fontSize: 11, color: theme.colors.muted, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  metaValue: { fontSize: theme.fonts.sizes.sm, color: theme.colors.text, fontWeight: '700' },

  section: { marginBottom: theme.spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  sectionTitle: { fontSize: theme.fonts.sizes.lg, fontWeight: '800', color: theme.colors.text },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { fontSize: theme.fonts.sizes.sm, fontWeight: '700', color: theme.colors.brand },

  timeline: { paddingLeft: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: theme.spacing.lg },
  timelineLeft: { alignItems: 'center', width: 20, marginRight: theme.spacing.md },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.brand, zIndex: 10 },
  timelineLine: { width: 2, flex: 1, backgroundColor: theme.colors.border, marginTop: -4, marginBottom: -28 },
  
  timelineContent: { flex: 1, marginTop: -4 },
  historyDate: { fontSize: theme.fonts.sizes.xs, fontWeight: '700', color: theme.colors.muted, marginBottom: theme.spacing.sm },
  historyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  historyTitle: { fontSize: theme.fonts.sizes.md, fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  historyGarage: { fontSize: theme.fonts.sizes.sm, color: theme.colors.muted, fontWeight: '500' },
  historyDivider: { height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing.sm },
  historyCost: { fontSize: theme.fonts.sizes.sm, fontWeight: '700', color: theme.colors.brand },
}));
