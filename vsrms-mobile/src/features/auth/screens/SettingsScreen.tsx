import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView,
  ActivityIndicator, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { useUpdateMe } from '../queries/mutations';

const ROLE_LABELS: Record<string, string> = {
  customer:       'Vehicle Owner',
  workshop_owner: 'Workshop Owner',
  workshop_staff: 'Technician',
  admin:          'Administrator',
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  customer:       { bg: '#EFF6FF', text: '#2563EB' },
  workshop_owner: { bg: '#FFF7ED', text: '#EA580C' },
  workshop_staff: { bg: '#F0FDF4', text: '#15803D' },
  admin:          { bg: '#FDF4FF', text: '#9333EA' },
};

export default function SettingsScreen() {
  const router  = useRouter();
  const { user, signOut } = useAuth();
  const { mutate: update, isPending } = useUpdateMe();

  const [editing, setEditing]     = useState(false);
  const [fullName, setFullName]   = useState(user?.fullName ?? '');
  const [phone, setPhone]         = useState((user as any)?.phone ?? '');

  const initials = (user?.fullName ?? user?.email ?? 'ME')
    .split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  const roleCfg    = ROLE_COLORS[user?.role ?? 'customer'];
  const roleLabel  = ROLE_LABELS[user?.role ?? 'customer'];
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : 'N/A';

  const handleSave = () => {
    update(
      { fullName: fullName.trim() || undefined, phone: (phone.trim() || undefined) as any },
      { onSuccess: () => setEditing(false) },
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── Dark top section ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSub}>Account</Text>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.avatarName}>{user?.fullName ?? 'No Name'}</Text>
          <View style={[styles.roleBadge, { backgroundColor: roleCfg.bg }]}>
            <Text style={[styles.roleText, { color: roleCfg.text }]}>{roleLabel}</Text>
          </View>
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── White card ── */}
      <View style={[styles.mainCard, { overflow: 'hidden' }]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Profile Info */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Profile Details</Text>
              {!editing && (
                <TouchableOpacity onPress={() => setEditing(true)} activeOpacity={0.7}>
                  <View style={styles.editBtn}>
                    <Ionicons name="create-outline" size={14} color="#F56E0F" />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {editing ? (
              <View style={styles.editCard}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Your full name"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+94 77 000 0000"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => { setEditing(false); setFullName(user?.fullName ?? ''); setPhone((user as any)?.phone ?? ''); }}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.saveBtn, isPending && { opacity: 0.7 }]} onPress={handleSave} disabled={isPending}>
                    {isPending
                      ? <ActivityIndicator color="#FFF" size="small" />
                      : <Text style={styles.saveBtnText}>Save Changes</Text>
                    }
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.infoCard}>
                <InfoRow icon="person-outline" label="Full Name" value={user?.fullName ?? 'Not set'} />
                <InfoRow icon="mail-outline" label="Email" value={user?.email ?? ''} />
                <InfoRow icon="call-outline" label="Phone" value={(user as any)?.phone ?? 'Not set'} />
                <InfoRow icon="calendar-outline" label="Member Since" value={memberSince} last />
              </View>
            )}
          </View>

          {/* Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View style={styles.infoCard}>
              <TouchableOpacity
                style={styles.securityRow}
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert(
                    'Change Password',
                    'Password changes are managed through your identity provider. Please use the "Forgot Password" option on the login screen to reset your password.',
                    [{ text: 'OK' }],
                  )
                }
              >
                <View style={styles.securityIconBox}>
                  <Ionicons name="lock-closed-outline" size={18} color="#F56E0F" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.securityLabel}>Change Password</Text>
                  <Text style={styles.securitySub}>Reset via login screen</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Out */}
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>VSRMS v1.0.0</Text>

        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

function InfoRow({ icon, label, value, last }: { icon: any; label: string; value: string; last?: boolean }) {
  return (
    <View style={[infoRowStyles.row, !last && infoRowStyles.rowBorder]}>
      <View style={infoRowStyles.iconBox}>
        <Ionicons name={icon} size={16} color="#6B7280" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={infoRowStyles.label}>{label}</Text>
        <Text style={infoRowStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const infoRowStyles = StyleSheet.create(() => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  iconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.3 },
  value: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginTop: 1 },
}));

const styles = StyleSheet.create((theme) => ({
  topSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerSub: { fontSize: theme.fonts.sizes.caption, color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  headerTitle: { fontSize: theme.fonts.sizes.pageTitle, color: '#FFFFFF', fontWeight: '900', letterSpacing: -0.5, marginTop: 2 },

  avatarSection: { alignItems: 'center', gap: 10, paddingBottom: 8, zIndex: 10 },
  avatar: { width: 72, height: 72, borderRadius: 22, backgroundColor: 'rgba(245,110,15,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F56E0F' },
  avatarText: { fontSize: 24, fontWeight: '900', color: '#F56E0F' },
  avatarName: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.3 },
  roleBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10 },
  roleText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  decCircle1: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(245,110,15,0.13)', top: -25, right: -25 },
  decCircle2: { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(245,110,15,0.08)', bottom: 0, right: 90 },

  mainCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: 16, flex: 1 },
  scroll: { paddingHorizontal: theme.spacing.screenPadding, paddingTop: 28, paddingBottom: 130 },

  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.3 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFF7ED', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { fontSize: 12, fontWeight: '800', color: '#F56E0F' },

  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 16, borderWidth: 1.5, borderColor: '#F3F4F6' },

  editCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: '#F3F4F6' },
  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.3 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 12, height: 48, paddingHorizontal: 14, fontSize: 15, color: '#1A1A2E', borderWidth: 1.5, borderColor: '#E5E7EB', fontWeight: '600' },
  editActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#E5E7EB' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  saveBtn: { flex: 1, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F56E0F' },
  saveBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },

  securityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  securityIconBox: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' },
  securityLabel: { fontSize: 14, fontWeight: '800', color: '#1A1A2E' },
  securitySub: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },

  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#FEF2F2', borderRadius: 16, height: 54, borderWidth: 1.5, borderColor: '#FECACA', marginBottom: 20 },
  signOutText: { fontSize: 15, fontWeight: '800', color: '#EF4444' },
  version: { textAlign: 'center', fontSize: 12, color: '#D1D5DB', fontWeight: '600' },
}));
