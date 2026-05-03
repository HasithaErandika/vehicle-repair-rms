import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Receipt, Wrench, PenTool, Milestone } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { ServiceRecord } from '../types/records.types';

interface RecordCardProps {
  record: ServiceRecord;
  /** Optional route prefix for the detail navigation (default: no prefix, navigates to root detail route). */
  detailRoute?: string;
}

export function RecordCard({ record, detailRoute }: RecordCardProps) {
  const { theme } = useUnistyles();
  const router = useRouter();
  const dateStr = new Date(record.serviceDate).toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const handlePress = () => {
    const id = record._id || record.id;
    if (!id) return;
    router.push({ pathname: detailRoute || '/record/[id]', params: { id } } as any);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Receipt size={22} color={theme.colors.brand} strokeWidth={2} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.serviceDate}>{dateStr}</Text>
          {record.technicianName ? (
            <Text style={styles.techName}>Tech: {record.technicianName}</Text>
          ) : (
            <Text style={styles.techName}>Staff Log</Text>
          )}
        </View>
        {record.totalCost != null && (
          <View style={styles.costBadge}>
            <Text style={styles.costText}>LKR {record.totalCost.toLocaleString()}</Text>
          </View>
        )}
      </View>

      <View style={styles.workBox}>
        <View style={styles.workHeader}>
           <Wrench size={14} color={theme.colors.text} strokeWidth={2.5} />
           <Text style={styles.workTitle}>Work Done</Text>
        </View>
        <Text style={styles.workDone} numberOfLines={2}>{record.workDone}</Text>
      </View>

      <View style={styles.footerRow}>
        {record.partsReplaced && record.partsReplaced.length > 0 && (
          <View style={styles.metaItem}>
            <PenTool size={12} color={theme.colors.muted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {record.partsReplaced.length} Parts
            </Text>
          </View>
        )}
        {record.mileageAtService ? (
          <View style={styles.metaItem}>
            <Milestone size={12} color={theme.colors.muted} />
            <Text style={styles.metaText}>{record.mileageAtService.toLocaleString()} km</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  iconBox: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: theme.colors.brandSoft,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(245, 110, 15, 0.15)',
  },
  headerInfo: { flex: 1 },
  serviceDate: { fontSize: 16, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.3 },
  techName: { fontSize: 12, color: theme.colors.muted, fontWeight: '700', marginTop: 2 },
  
  costBadge: {
    backgroundColor: '#ECFDF5', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 8,
  },
  costText: { fontSize: 11, fontWeight: '900', color: '#059669' },

  workBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  workHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  workTitle: { fontSize: 11, fontWeight: '800', color: theme.colors.text, textTransform: 'uppercase', letterSpacing: 0.5 },
  workDone: { fontSize: 14, fontWeight: '600', color: theme.colors.muted, lineHeight: 20 },

  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: theme.colors.muted, fontWeight: '700' },
}));


