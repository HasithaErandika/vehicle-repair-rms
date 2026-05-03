import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Wrench, DollarSign, FileText, ChevronLeft, Milestone, User, Pencil, Trash2 } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useRecord } from '../queries/queries';
import { useDeleteRecord } from '../queries/mutations';
import { handleApiError } from '@/services/error.handler';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { useAuth } from '@/hooks';

export function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { user } = useAuth();

  const { data: record, isLoading, isError, error, refetch } = useRecord(id!);
  const { mutate: deleteRecord, isPending: isDeleting } = useDeleteRecord();

  // Role-based action visibility
  const canEdit   = user?.role === 'workshop_staff' || user?.role === 'workshop_owner' || user?.role === 'admin';
  const canDelete = user?.role === 'workshop_owner' || user?.role === 'admin';

  const handleEdit = () => {
    if (!id) return;
    // Navigate to role-specific edit route
    const prefix = user?.role === 'workshop_owner' ? '/owner' : '/technician';
    router.push({ pathname: `${prefix}/edit-record`, params: { id } } as any);
  };

  const handleDeleteConfirm = () => {
    Alert.alert(
      'Delete Service Record',
      'This action cannot be undone. The record will be permanently removed from the system.\n\nAre you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteRecord(id!, {
              onSuccess: () => router.back(),
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSub}>Technical Archive</Text>
            <Text style={styles.headerTitle}>Record Details</Text>
          </View>
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={styles.mainCard}>
        {isLoading && !record ? (
           <View style={styles.centered}><ActivityIndicator size="large" color="#F56E0F" /></View>
        ) : isError ? (
           <ErrorScreen onRetry={refetch} variant="inline" message={handleApiError(error)} />
        ) : !record ? (
           <View style={styles.centered}><Text style={{ color: '#9CA3AF' }}>Record not found</Text></View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                 <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                    <Calendar size={20} color="#3B82F6" />
                 </View>
                 <View style={styles.infoContent}>
                    <Text style={styles.label}>Service Date</Text>
                    <Text style={styles.value}>{new Date(record.serviceDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</Text>
                 </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                 <View style={[styles.iconBox, { backgroundColor: '#FDF2F8' }]}>
                    <User size={20} color="#DB2777" />
                 </View>
                 <View style={styles.infoContent}>
                    <Text style={styles.label}>Performed By</Text>
                    <Text style={styles.value}>{record.technicianName || 'Garage Staff'}</Text>
                 </View>
              </View>

              {record.mileageAtService && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                        <Milestone size={20} color="#059669" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.label}>Odometer Reading</Text>
                        <Text style={styles.value}>{record.mileageAtService.toLocaleString()} km</Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={styles.sectionHeader}>
               <Wrench size={18} color="#1A1A2E" strokeWidth={2.5} />
               <Text style={styles.sectionTitle}>Main Work Performed</Text>
            </View>
            <View style={styles.descriptionBox}>
               <Text style={styles.descriptionText}>{record.workDone}</Text>
            </View>

            {record.totalCost != null && (
              <View style={styles.costHighlight}>
                 <View style={styles.costHeader}>
                    <DollarSign size={16} color="#059669" />
                    <Text style={styles.costLabel}>Total Billing</Text>
                 </View>
                 <Text style={styles.costValue}>LKR {record.totalCost.toLocaleString()}</Text>
              </View>
            )}

            {record.partsReplaced && record.partsReplaced.length > 0 && (
              <View style={styles.infoRowContainer}>
                <Text style={styles.sectionTitleSmall}>Parts Replaced</Text>
                <View style={styles.partsGrid}>
                  {record.partsReplaced.map((part, index) => (
                    <View key={index} style={styles.partItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.partText}>{part}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {record.documents && record.documents.length > 0 && (
              <TouchableOpacity style={styles.docBtn} activeOpacity={0.7}>
                <FileText size={20} color={theme.colors.brand} />
                <Text style={styles.docBtnText}>View {record.documents.length} Attachments</Text>
              </TouchableOpacity>
            )}

            {/* ── STAFF ACTION BUTTONS ── */}
            {(canEdit || canDelete) && (
              <View style={styles.actionRow}>
                {canEdit && (
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={handleEdit}
                    activeOpacity={0.8}
                  >
                    <Pencil size={18} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.editBtnText}>Edit Record</Text>
                  </TouchableOpacity>
                )}
                {canDelete && (
                  <TouchableOpacity
                    style={[styles.deleteBtn, isDeleting && { opacity: 0.6 }]}
                    onPress={handleDeleteConfirm}
                    disabled={isDeleting}
                    activeOpacity={0.8}
                  >
                    {isDeleting
                      ? <ActivityIndicator size="small" color="#DC2626" />
                      : <Trash2 size={18} color="#DC2626" strokeWidth={2.5} />
                    }
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  topSection: { 
    paddingHorizontal: theme.spacing.screenPadding, 
    paddingTop: 16, 
    paddingBottom: theme.spacing.headerBottom, 
    position: 'relative', 
    overflow: 'hidden' 
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 20, zIndex: 10, marginTop: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerSub: { 
    fontSize: theme.fonts.sizes.caption, 
    color: 'rgba(255,255,255,0.7)', 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  headerTitle: { 
    fontSize: theme.fonts.sizes.pageTitle, 
    color: '#FFFFFF', 
    fontWeight: '900', 
    letterSpacing: -0.5, 
    marginTop: 4 
  },

  decCircle1: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(245,110,15,0.13)', top: -25, right: -25 },
  decCircle2: { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(245,110,15,0.08)', bottom: 10, right: 90 },

  mainCard: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    marginTop: theme.spacing.cardOverlap, 
    flex: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 20, 
    elevation: 16 
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { 
    paddingHorizontal: theme.spacing.screenPadding, 
    paddingTop: 32, 
    paddingBottom: 130 
  },

  infoCard: { backgroundColor: '#F9FAFB', borderRadius: 24, padding: 20, marginBottom: 32, borderWidth: 1.5, borderColor: '#F3F4F6' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  label: { fontSize: 10, fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginTop: 4 },
  divider: { height: 1.5, backgroundColor: '#F3F4F6', marginVertical: 16 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.5 },
  descriptionBox: { backgroundColor: '#FAFAFA', borderRadius: 16, padding: 20, marginBottom: 28, borderWidth: 1.5, borderColor: '#F3F4F6', borderStyle: 'dashed' },
  descriptionText: { fontSize: 15, color: '#4B5563', lineHeight: 24, fontWeight: '600' },

  costHighlight: { backgroundColor: '#ECFDF5', borderRadius: 20, padding: 20, marginBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  costHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  costLabel: { fontSize: 12, fontWeight: '900', color: '#059669', textTransform: 'uppercase' },
  costValue: { fontSize: 20, fontWeight: '900', color: '#059669' },

  infoRowContainer: { marginTop: 32 },
  sectionTitleSmall: { fontSize: 13, fontWeight: '900', color: '#1A1A2E', textTransform: 'uppercase', marginBottom: 16, letterSpacing: 0.5, marginLeft: 4 },
  partsGrid: { gap: 12, marginLeft: 4 },
  partItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.brand },
  partText: { fontSize: 14, color: '#4B5563', fontWeight: '700' },

  docBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16, backgroundColor: theme.colors.brandSoft, marginTop: 32, borderWidth: 1.5, borderColor: 'rgba(245, 110, 15, 0.1)' },
  docBtnText: { fontSize: 14, fontWeight: '800', color: theme.colors.brand },

  // ── Action buttons ──────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 36,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.brand,
    borderRadius: 18,
    height: 54,
    shadowColor: theme.colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  editBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 18,
    height: 54,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  deleteBtnText: { color: '#DC2626', fontWeight: '900', fontSize: 15 },
}));
