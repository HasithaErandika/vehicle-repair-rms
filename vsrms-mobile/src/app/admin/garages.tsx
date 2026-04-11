import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

const GARAGES = [
  { id: 1, name: 'AutoCare Colombo', address: '123 Main St, Colombo 03', status: 'Verified', owners: 2, users: 15 },
  { id: 2, name: 'Precision Motors', address: '45 Galle Rd, Dehiwala', status: 'Pending', owners: 1, users: 5 },
  { id: 3, name: 'Hybrid Hub Kandy', address: '88 Kandy Rd, Kandy', status: 'Verified', owners: 3, users: 24 },
];

export default function GarageManagementScreen() {
  const { theme } = useUnistyles();

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service Centers</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={theme.colors.muted} />
        <TextInput 
          placeholder="Search garages by name or pin..." 
          placeholderTextColor={theme.colors.muted}
          style={styles.searchInput} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {GARAGES.map(g => (
          <TouchableOpacity key={g.id} style={styles.card} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
              <View style={styles.nameBlock}>
                <Text style={styles.garageName}>{g.name}</Text>
                <View style={[styles.statusBadge, g.status === 'Verified' ? styles.statusVerified : styles.statusPending]}>
                  <Text style={[styles.statusText, g.status === 'Verified' ? styles.textVerified : styles.textPending]}>
                    {g.status}
                  </Text>
                </View>
              </View>
              <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.muted} />
            </View>
            
            <Text style={styles.address}>{g.address}</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.miniStat}>
                <Ionicons name="person-circle-outline" size={16} color={theme.colors.muted} />
                <Text style={styles.miniStatText}>{g.owners} Owners</Text>
              </View>
              <View style={styles.statSep} />
              <View style={styles.miniStat}>
                <Ionicons name="people-outline" size={16} color={theme.colors.muted} />
                <Text style={styles.miniStatText}>{g.users} Employees</Text>
              </View>
            </View>

            <View style={styles.btnGroup}>
              <TouchableOpacity style={styles.btnOutline}>
                <Text style={styles.btnOutlineText}>Manage Staff</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOutline}>
                <Text style={styles.btnOutlineText}>Analytics</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  addBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.brand, alignItems: 'center', justifyContent: 'center' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '500', color: theme.colors.text },

  scroll: { paddingHorizontal: theme.spacing.md, paddingBottom: 120 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  nameBlock: { flex: 1 },
  garageName: { fontSize: 17, fontWeight: '800', color: theme.colors.text, marginBottom: 6 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusVerified: { backgroundColor: theme.colors.successBackground },
  statusPending: { backgroundColor: theme.colors.warningBackground },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  textVerified: { color: theme.colors.successText },
  textPending: { color: theme.colors.warningText },

  address: { fontSize: 14, color: theme.colors.muted, fontWeight: '500', marginBottom: 16 },
  
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniStatText: { fontSize: 13, fontWeight: '600', color: theme.colors.muted },
  statSep: { width: 1, height: 12, backgroundColor: theme.colors.border },

  btnGroup: { flexDirection: 'row', gap: 12 },
  btnOutline: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background 
  },
  btnOutlineText: { fontSize: 13, fontWeight: '700', color: theme.colors.text }
}));
