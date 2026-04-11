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

const USERS = [
  { id: 1, name: 'Saman Silva', email: 'saman@example.com', role: 'Staff', status: 'Active', garage: 'AutoCare Colombo' },
  { id: 2, name: 'John Perera', email: 'john@example.com', role: 'Customer', status: 'Active', garage: null },
  { id: 3, name: 'Kamal Bandara', email: 'kamal@example.com', role: 'Garage Owner', status: 'Active', garage: 'Precision Motors' },
  { id: 4, name: 'Kasun Bandara', email: 'kasun@gmail.com', role: 'Technician', status: 'Suspended', garage: 'AutoCare Colombo' },
];

export default function UserManagementScreen() {
  const { theme } = useUnistyles();

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Directory</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={theme.colors.muted} />
        <TextInput 
          placeholder="Search by name, email or ID..." 
          placeholderTextColor={theme.colors.muted}
          style={styles.searchInput} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {USERS.map(u => (
          <TouchableOpacity key={u.id} style={styles.card} activeOpacity={0.7}>
            <View style={styles.cardRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{u.name.split(' ').map(n=>n[0]).join('')}</Text>
              </View>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{u.name}</Text>
                  <View style={[styles.roleBadge, styles.badgeColor(u.role, theme)]}>
                    <Text style={[styles.roleText, styles.roleTextColor(u.role, theme)]}>{u.role}</Text>
                  </View>
                </View>
                <Text style={styles.email}>{u.email}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusPill, u.status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                    <Text style={[styles.statusPillText, u.status === 'Active' ? styles.textActive : styles.textInactive]}>
                      {u.status}
                    </Text>
                  </View>
                  {u.garage && (
                    <Text style={styles.garageName}>• {u.garage}</Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.border} />
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
  filterBtn: { 
    width: 44, height: 44, borderRadius: 12, 
    borderWidth: 1, borderColor: theme.colors.border, 
    alignItems: 'center', justifyContent: 'center' 
  },

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
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { 
    width: 48, height: 48, borderRadius: 24, 
    backgroundColor: theme.colors.background, 
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: theme.colors.border
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: theme.colors.brand },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  userName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  roleText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  
  badgeColor: (role, theme) => {
    switch(role) {
      case 'Admin': return { backgroundColor: theme.colors.brandSoft };
      case 'Staff': return { backgroundColor: theme.colors.successBackground };
      case 'Garage Owner': return { backgroundColor: theme.colors.warningBackground };
      case 'Technician': return { backgroundColor: theme.colors.infoBackground || '#EEF2FF' };
      default: return { backgroundColor: theme.colors.background };
    }
  },
  roleTextColor: (role, theme) => {
    switch(role) {
      case 'Admin': return { color: theme.colors.brand };
      case 'Staff': return { color: theme.colors.successText };
      case 'Garage Owner': return { color: theme.colors.warningText };
      default: return { color: theme.colors.muted };
    }
  },

  email: { fontSize: 13, color: theme.colors.muted, fontWeight: '500', marginBottom: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusActive: { backgroundColor: theme.colors.successBackground },
  statusInactive: { backgroundColor: '#FEF2F2' },
  statusPillText: { fontSize: 10, fontWeight: '800' },
  textActive: { color: theme.colors.successText },
  textInactive: { color: '#DC2626' },
  garageName: { fontSize: 12, color: theme.colors.muted, fontWeight: '600' }
}));
