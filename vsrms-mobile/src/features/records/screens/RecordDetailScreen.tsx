import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Calendar, Wrench, DollarSign, FileText } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useRecord } from '../queries/queries';
import { handleApiError } from '@/services/error.handler';

export function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: record, isLoading, isError, error } = useRecord(id!);
  const { theme } = useUnistyles();

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (isError) return <Text style={{ color: 'red', padding: 20 }}>{handleApiError(error)}</Text>;
  if (!record) return <Text style={{ padding: 20 }}>Record not found</Text>;

  return (
    <ScreenWrapper scroll>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Service Details</Text>
          <Text style={styles.date}>{new Date(record.serviceDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.item}>
             <Calendar size={20} color={theme.colors.brand} />
             <View>
               <Text style={styles.label}>Date</Text>
               <Text style={styles.value}>{new Date(record.serviceDate).toLocaleDateString()}</Text>
             </View>
          </View>

          <View style={styles.item}>
             <Wrench size={20} color={theme.colors.brand} />
             <View>
               <Text style={styles.label}>Description</Text>
               <Text style={styles.value}>{record.description}</Text>
             </View>
          </View>

          {record.cost && (
            <View style={styles.item}>
               <DollarSign size={20} color={theme.colors.brand} />
               <View>
                 <Text style={styles.label}>Total Cost</Text>
                 <Text style={styles.value}>LKR {record.cost.toLocaleString()}</Text>
               </View>
            </View>
          )}
        </View>

        {record.partsReplaced && record.partsReplaced.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parts Replaced</Text>
            <View style={styles.list}>
              {record.partsReplaced.map((part, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.listItemText}>{part}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {record.documents && record.documents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            <View style={styles.attachmentRow}>
               <FileText size={24} color={theme.colors.muted} />
               <Text style={styles.attachmentText}>{record.documents.length} document(s) attached</Text>
            </View>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { padding: theme.spacing.md },
  header: { marginBottom: theme.spacing.xl },
  title: { fontSize: theme.fonts.sizes.xxl, fontWeight: '800', color: theme.colors.text },
  date: { fontSize: theme.fonts.sizes.sm, color: theme.colors.muted, marginTop: 4 },
  card: { 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.radii.lg, 
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 20
  },
  item: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  label: { fontSize: theme.fonts.sizes.xs, color: theme.colors.muted, textTransform: 'uppercase', fontWeight: '700' },
  value: { fontSize: theme.fonts.sizes.md, color: theme.colors.text, fontWeight: '600', marginTop: 2 },
  section: { marginTop: theme.spacing.xl },
  sectionTitle: { fontSize: theme.fonts.sizes.lg, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.md },
  list: { gap: 8 },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.brand },
  listItemText: { fontSize: theme.fonts.sizes.md, color: theme.colors.text },
  attachmentRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    backgroundColor: theme.colors.background, 
    padding: theme.spacing.md, 
    borderRadius: theme.radii.md 
  },
  attachmentText: { fontSize: theme.fonts.sizes.sm, color: theme.colors.muted, fontWeight: '500' },
}));
