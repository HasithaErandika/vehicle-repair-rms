import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView,
  ActivityIndicator, Modal, Pressable,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ConfirmModal } from '@/components/feedback/ConfirmModal';
import { useAuth } from '@/hooks';
import { useUpdateMe } from '../queries/mutations';

const ROLE_LABELS: Record<string, string> = {
  customer:       'Vehicle Owner',
  workshop_owner: 'Workshop Owner',
  workshop_staff: 'Technician',
  admin:          'Administrator',
};

export default function SettingsScreen() {
  const { theme } = useUnistyles();
  const { user, signOut, refreshUser } = useAuth();
  const { mutate: update, isPending } = useUpdateMe();

  const [editing, setEditing]     = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [fullName, setFullName]   = useState(user?.fullName ?? '');
  const [phone, setPhone]         = useState((user as any)?.phone ?? '');
  const [modalErrors, setModalErrors] = useState({ fullName: '', phone: '' });

  const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
    customer:       { bg: theme.colors.infoBackground, text: theme.colors.infoText },
    workshop_owner: { bg: theme.colors.warningBackground, text: theme.colors.warningText },
    workshop_staff: { bg: theme.colors.successBackground, text: theme.colors.successText },
    admin:          { bg: '#FDF4FF', text: '#9333EA' }, 
  };

  const initials = (user?.fullName ?? user?.email ?? 'ME')
    .split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  const roleCfg    = ROLE_COLORS[user?.role ?? 'customer'];
  const roleLabel  = ROLE_LABELS[user?.role ?? 'customer'];
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : 'N/A';

  const validateModal = (): boolean => {
    const errs = { fullName: '', phone: '' };
    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    if (phone.trim() && !/^[\d\s+\-()]{7,15}$/.test(phone.trim())) errs.phone = 'Enter a valid phone number.';
    setModalErrors(errs);
    return !errs.fullName && !errs.phone;
  };

  const handleSave = () => {
    if (!validateModal()) return;
    update(
      { fullName: fullName.trim() || undefined, phone: (phone.trim() || undefined) as any } as any,
      {
        onSuccess: async () => {
          setEditing(false);
          setModalErrors({ fullName: '', phone: '' });
          await refreshUser();
        },
      },
    );
  };

  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  return (
    <ScreenWrapper bg={theme.colors.text}>
      {/* ── Dark top section ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
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
                <TouchableOpacity 
                  onPress={() => setEditing(true)} 
                  activeOpacity={0.7}
                  accessibilityLabel="Edit profile"
                  accessibilityRole="button"
                >
                  <View style={styles.editBtn}>
                    <Ionicons name="create-outline" size={14} color={theme.colors.brand} />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.infoCard}>
              <InfoRow icon="person-outline" label="Full Name" value={user?.fullName ?? 'Not set'} />
              <InfoRow icon="mail-outline" label="Email" value={user?.email ?? ''} />
              <InfoRow icon="call-outline" label="Phone" value={(user as any)?.phone ?? 'Not set'} />
              <InfoRow icon="calendar-outline" label="Member Since" value={memberSince} last />
            </View>
          </View>

          {/* Profile Edit Modal */}
          <Modal visible={editing} animationType="none" transparent onRequestClose={() => setEditing(false)}>
            <Animated.View style={StyleSheet.absoluteFill} entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setEditing(false)} />
              </BlurView>
            </Animated.View>
            <View style={styles.modalBg}>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
                <Animated.View 
                  style={styles.modalContent}
                  entering={FadeInDown.springify().damping(20).stiffness(200).mass(0.8)}
                  exiting={FadeOutDown.duration(200)}
                >
                  <View style={styles.modalHandle} />
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Edit Profile</Text>
                    <TouchableOpacity 
                      onPress={() => setEditing(false)} 
                      style={styles.closeBtn}
                      accessibilityLabel="Close modal"
                    >
                      <Ionicons name="close" size={20} color={theme.colors.muted} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name <Text style={styles.modalRequired}>*</Text></Text>
                    <TextInput
                      style={[styles.input, !!modalErrors.fullName && styles.inputModalError]}
                      value={fullName}
                      onChangeText={(t) => { setFullName(t); if (modalErrors.fullName) setModalErrors(e => ({ ...e, fullName: '' })); }}
                      placeholder="Your full name"
                      placeholderTextColor={theme.colors.mutedLight}
                      autoCapitalize="words"
                    />
                    {!!modalErrors.fullName && <Text style={styles.modalErrorText}>{modalErrors.fullName}</Text>}
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone Number <Text style={styles.modalOptional}>(optional)</Text></Text>
                    <TextInput
                      style={[styles.input, !!modalErrors.phone && styles.inputModalError]}
                      value={phone}
                      onChangeText={(t) => { setPhone(t); if (modalErrors.phone) setModalErrors(e => ({ ...e, phone: '' })); }}
                      placeholder="+94 77 000 0000"
                      placeholderTextColor={theme.colors.mutedLight}
                      keyboardType="phone-pad"
                    />
                    {!!modalErrors.phone && <Text style={styles.modalErrorText}>{modalErrors.phone}</Text>}
                  </View>

                  <TouchableOpacity 
                    style={[styles.saveBtn, isPending && { opacity: 0.7 }]} 
                    onPress={handleSave} 
                    disabled={isPending}
                    accessibilityLabel="Save changes"
                    accessibilityRole="button"
                  >
                    {isPending
                      ? <ActivityIndicator color={theme.colors.white} size="small" />
                      : <Text style={styles.saveBtnText}>Save Changes</Text>
                    }
                  </TouchableOpacity>
                </Animated.View>
              </KeyboardAvoidingView>
            </View>
          </Modal>

          {/* Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View style={styles.infoCard}>
              <TouchableOpacity
                style={styles.securityRow}
                activeOpacity={0.7}
                onPress={() => setShowPasswordInfo(true)}
                accessibilityLabel="Change password information"
                accessibilityRole="button"
              >
                <View style={styles.securityIconBox}>
                  <Ionicons name="lock-closed-outline" size={18} color={theme.colors.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.securityLabel}>Change Password</Text>
                  <Text style={styles.securitySub}>Reset via login screen</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.mutedLight} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Out */}
          <TouchableOpacity 
            style={styles.signOutBtn} 
            onPress={handleSignOut} 
            activeOpacity={0.8}
            accessibilityLabel="Sign out"
            accessibilityRole="button"
          >
            <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>VSRMS v1.0.0</Text>

        </ScrollView>
      </View>

      <ConfirmModal
        visible={showSignOutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        type="danger"
        onConfirm={signOut}
        onCancel={() => setShowSignOutConfirm(false)}
      />

      <ConfirmModal
        visible={showPasswordInfo}
        title="Change Password"
        message="Password changes are managed through your identity provider. Please use the 'Forgot Password' option on the login screen to reset your password."
        confirmText="OK"
        onConfirm={() => setShowPasswordInfo(false)}
        onCancel={() => setShowPasswordInfo(false)}
      />
    </ScreenWrapper>
  );
}

function InfoRow({ icon, label, value, last }: { icon: any; label: string; value: string; last?: boolean }) {
  const { theme } = useUnistyles();
  return (
    <View style={[infoRowStyles.row, !last && infoRowStyles.rowBorder]}>
      <View style={infoRowStyles.iconBox}>
        <Ionicons name={icon} size={16} color={theme.colors.muted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={infoRowStyles.label}>{label}</Text>
        <Text style={infoRowStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const infoRowStyles = StyleSheet.create((theme) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  iconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, fontWeight: '700', color: theme.colors.mutedLight, textTransform: 'uppercase', letterSpacing: 0.3 },
  value: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginTop: 1 },
}));

const styles = StyleSheet.create((theme) => ({
  topSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 60,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.text,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24, marginTop: 12 },
  headerSub: { fontSize: theme.fonts.sizes.caption, color: theme.colors.whiteAlpha70, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  headerTitle: { fontSize: theme.fonts.sizes.pageTitle, color: theme.colors.white, fontWeight: '900', letterSpacing: -0.5, marginTop: 2 },

  avatarSection: { alignItems: 'center', gap: 10, paddingBottom: 8, zIndex: 10 },
  avatar: { width: 72, height: 72, borderRadius: 22, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: theme.colors.brand },
  avatarText: { fontSize: 24, fontWeight: '900', color: theme.colors.brand },
  avatarName: { fontSize: 20, fontWeight: '900', color: theme.colors.white, letterSpacing: -0.3 },
  roleBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10 },
  roleText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  decCircle1: { zIndex: 0, position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: theme.colors.brandMuted, top: -30, right: -20 },
  decCircle2: { zIndex: 0, position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.brandFaint, bottom: 10, right: 100 },

  mainCard: { backgroundColor: theme.colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: theme.spacing.cardOverlap, flex: 1, shadowColor: theme.colors.black, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 16 },
  scroll: { paddingHorizontal: theme.spacing.screenPadding, paddingTop: 28, paddingBottom: theme.spacing.listBottomPadding },

  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.3 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: theme.colors.warningBackground, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { fontSize: 12, fontWeight: '800', color: theme.colors.brand },

  infoCard: { backgroundColor: theme.colors.background, borderRadius: 18, paddingHorizontal: 16, borderWidth: 1.5, borderColor: theme.colors.borderLight },

  editCard: { backgroundColor: theme.colors.background, borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: theme.colors.borderLight },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: theme.colors.muted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.3 },
  input: { backgroundColor: theme.colors.surface, borderRadius: 14, height: 54, paddingHorizontal: 16, fontSize: 15, color: theme.colors.text, borderWidth: 1.5, borderColor: theme.colors.border, fontWeight: '600' },
  inputModalError: { borderColor: theme.colors.error, backgroundColor: theme.colors.errorBackground },
  modalRequired: { color: theme.colors.error, fontWeight: '900' },
  modalOptional: { fontWeight: '500', color: theme.colors.mutedLight, textTransform: 'none' as any, letterSpacing: 0 },
  modalErrorText: { fontSize: 12, color: theme.colors.error, fontWeight: '600', marginTop: 6, marginLeft: 2 },
  editActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: theme.colors.border },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: theme.colors.muted },
  saveBtn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.brand, shadowColor: theme.colors.brand, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: theme.colors.white },

  // Modal Styles
  modalBg: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingTop: 12 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: theme.colors.border, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: theme.colors.text },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.borderLight, alignItems: 'center', justifyContent: 'center' },


  securityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  securityIconBox: { width: 38, height: 38, borderRadius: 11, backgroundColor: theme.colors.warningBackground, alignItems: 'center', justifyContent: 'center' },
  securityLabel: { fontSize: 14, fontWeight: '800', color: theme.colors.text },
  securitySub: { fontSize: 12, color: theme.colors.mutedLight, fontWeight: '500', marginTop: 2 },

  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: theme.colors.errorBackground, borderRadius: 16, height: 54, borderWidth: 1.5, borderColor: '#FECACA', marginBottom: 20 },
  signOutText: { fontSize: 15, fontWeight: '800', color: theme.colors.error },
  version: { textAlign: 'center', fontSize: 12, color: theme.colors.mutedLight, fontWeight: '600' },
}));
