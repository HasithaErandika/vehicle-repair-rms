import React from 'react';
import { View, Text } from 'react-native';
import { FileText, ChevronRight } from 'lucide-react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ServiceRecord } from '../types/records.types';

export function RecordCard({ record }: { record: ServiceRecord }) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.iconBox}>
          <FileText size={24} color={theme.colors.brand} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{record.description}</Text>
          <Text style={styles.cardSubtitle}>{new Date(record.serviceDate).toLocaleDateString()}</Text>
          {record.cost !== undefined && (
            <Text style={styles.cost}>${record.cost.toFixed(2)}</Text>
          )}
        </View>
        <ChevronRight size={20} color={theme.colors.muted} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, padding: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.sm },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: theme.radii.sm, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.sm },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: theme.fonts.sizes.md, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  cardSubtitle: { fontSize: theme.fonts.sizes.sm, color: theme.colors.muted, fontWeight: '500', marginBottom: 4 },
  cost: { fontSize: theme.fonts.sizes.xs, fontWeight: '700', color: theme.colors.success },
}));
