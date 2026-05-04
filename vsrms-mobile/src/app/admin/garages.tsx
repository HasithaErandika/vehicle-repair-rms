import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator, StatusBar, Alert,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useWorkshops } from '@/features/workshops/queries/queries';
import { useDeactivateWorkshop } from '@/features/workshops/queries/mutations';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { ConfirmModal } from '@/components/feedback/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Workshop } from '@/features/workshops/types/workshops.types';

// ── Workshop card ─────────────────────────────────────────────────────────────

function WorkshopCard({ workshop, onDeactivate }: { workshop: Workshop; onDeactivate: () => void }) {
  const isActive = workshop.active !== false;

  return (
    <View style={[styles.card, !isActive && styles.cardInactive]}>
      <View style={styles.cardHeader}>
        <View style={[styles.workshopIcon, !isActive && { backgroundColor: '#F3F4F6' }]}>
          <Ionicons name="business" size={24} color={isActive ? '#F56E0F' : '#9CA3AF'} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.workshopName}>{workshop.name}</Text>
          <Text style={styles.workshopLocation}>{workshop.address}</Text>
          {workshop.ownerId ? (
            <Text style={styles.ownerLabel}>Owner-managed</Text>
          ) : (
            <Text style={styles.ownerLabel}>System workshop</Text>
          )}
        </View>
        {isActive && (
          <TouchableOpacity
            style={styles.deactivateBtn}
            onPress={onDeactivate}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="ban-outline" size={18} color="#EF4444" />
            <Text style={styles.deactivateBtnText}>Deactivate</Text>
          </TouchableOpacity>
        )}
        {!isActive && (
          <View style={styles.inactiveBadge}>
            <Ionicons name="ban" size={14} color="#9CA3AF" />
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.stat}>
          <Ionicons name="location-outline" size={12} color="#9CA3AF" />
          <Text style={styles.statText}>{workshop.district}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={styles.statText}>{workshop.averageRating?.toFixed(1) || '0.0'}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={12} color="#6B7280" />
          <Text style={styles.statText}>{workshop.totalReviews || 0} reviews</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isActive ? '#ECFDF5' : '#F3F4F6' }]}>
          <View style={[styles.statusDot, { backgroundColor: isActive ? '#10B981' : '#9CA3AF' }]} />
          <Text style={[styles.statusText, { color: isActive ? '#059669' : '#6B7280' }]}>
            {isActive ? 'Operational' : 'Deactivated'}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminGaragesScreen() {
  const { data: workshops, isLoading, isError, refetch } = useWorkshops();
  const { mutate: deactivate, isPending: deactivating }   = useDeactivateWorkshop();
  const [workshopToDeactivate, setWorkshopToDeactivate] = React.useState<Workshop | null>(null);

  const handleDeactivate = (workshop: Workshop) => {
    setWorkshopToDeactivate(workshop);
  };

  const confirmDeactivate = () => {
    if (workshopToDeactivate) {
      deactivate(workshopToDeactivate._id ?? workshopToDeactivate.id!);
      setWorkshopToDeactivate(null);
    }
  };

  const list = (
    <FlashList<Workshop>
      data={workshops || []}
      keyExtractor={item => item._id || item.id || ''}
      renderItem={({ item }) => (
        <WorkshopCard
          workshop={item}
          onDeactivate={() => handleDeactivate(item)}
        />
      )}
      // @ts-ignore
      estimatedItemSize={150}
      onRefresh={refetch}
      refreshing={isLoading}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <EmptyState message="No workshops in the system yet. Owners create their own workshops from the Garages tab." />
      }
    />
  );

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── Dark top section ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>Infrastructure</Text>
            <Text style={styles.headerTitle}>All Garages</Text>
          </View>
          {deactivating && <ActivityIndicator size="small" color="#F56E0F" />}
        </View>

        <View style={styles.infoNotice}>
          <Ionicons name="information-circle-outline" size={14} color="rgba(255,255,255,0.7)" />
          <Text style={styles.infoNoticeText}>
            Workshops are created by their owners. Admins can deactivate any workshop.
          </Text>
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── White card section ── */}
      <View style={[styles.mainCard, { overflow: 'hidden' }]}>
        {isLoading && !workshops ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#F56E0F" />
          </View>
        ) : isError ? (
          <ErrorScreen onRetry={refetch} variant="inline" />
        ) : list}
      </View>

      <ConfirmModal
        visible={!!workshopToDeactivate}
        title="Deactivate Garage"
        message={`Deactivating "${workshopToDeactivate?.name}" will remove it from customer search and disable new bookings. You can reactivate it later if needed.`}
        confirmText="Deactivate Garage"
        type="danger"
        onConfirm={confirmDeactivate}
        onCancel={() => setWorkshopToDeactivate(null)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  topSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 60,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1A1A2E'
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, marginBottom: 24, marginTop: 12 },
  headerSub: { fontSize: theme.fonts.sizes.caption, color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  headerTitle: { fontSize: theme.fonts.sizes.pageTitle, color: '#FFFFFF', fontWeight: '900', letterSpacing: -0.5, marginTop: 4 },

  infoNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 10, zIndex: 10 },
  infoNoticeText: { flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '500', lineHeight: 16 },

  decCircle1: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(245,110,15,0.12)', top: -30, right: -20 },
  decCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(245,110,15,0.06)', bottom: 10, right: 90 },

  mainCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: theme.spacing.cardOverlap, flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: theme.spacing.screenPadding, paddingTop: 24, paddingBottom: 130 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, marginBottom: 16, borderWidth: 1.5, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  cardInactive: { opacity: 0.55 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  workshopIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' },
  workshopName: { fontSize: 16, fontWeight: '900', color: '#1A1A2E' },
  workshopLocation: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginTop: 1 },
  ownerLabel: { fontSize: 10, color: '#6B7280', fontWeight: '600', marginTop: 3, fontStyle: 'italic' },
  deactivateBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, height: 34, borderRadius: 10, backgroundColor: '#FEF2F2', justifyContent: 'center' },
  deactivateBtnText: { fontSize: 12, fontWeight: '800', color: '#EF4444', textTransform: 'uppercase' },
  inactiveBadge: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },

  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', flexWrap: 'wrap' },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 'auto' },
  statusDot: { width: 5, height: 5, borderRadius: 2.5 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
}));
