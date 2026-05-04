import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useWorkshops } from '../queries/queries';
import { WorkshopCard } from '../components/WorkshopCard';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Workshop } from '../types/workshops.types';

const SL_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
  'Trincomalee', 'Vavuniya',
];

export function WorkshopListScreen() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const queryParams = selectedDistrict ? { district: selectedDistrict } : undefined;
  const { data, isLoading, isError, refetch } = useWorkshops(queryParams);

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerTextRow}>
          <View>
            <Text style={styles.headerSub}>Find Help</Text>
            <Text style={styles.headerTitle}>Nearby Garages</Text>
          </View>
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={[styles.mainCard, { overflow: 'hidden' }]}>

        {/* District filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <TouchableOpacity
            style={[styles.chip, !selectedDistrict && styles.chipActive]}
            onPress={() => setSelectedDistrict(null)}
          >
            <Text style={[styles.chipText, !selectedDistrict && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          {SL_DISTRICTS.map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, selectedDistrict === d && styles.chipActive]}
              onPress={() => setSelectedDistrict(prev => prev === d ? null : d)}
            >
              <Text style={[styles.chipText, selectedDistrict === d && styles.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading && !data ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#F56E0F" />
            <Text style={styles.loadingText}>Searching nearby...</Text>
          </View>
        ) : isError ? (
          <ErrorScreen onRetry={refetch} variant="inline" />
        ) : (
          <FlashList
             data={(data || []) as Workshop[]}
             renderItem={({ item }) => <WorkshopCard workshop={item as Workshop} />}
             // @ts-ignore
             estimatedItemSize={280}
             onRefresh={refetch}
             refreshing={isLoading}
             keyExtractor={(item: Workshop) => item._id || item.id || Math.random().toString()}
             contentContainerStyle={styles.list}
             ListEmptyComponent={<EmptyState message="No repair centers found in your area." />}
          />
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
  headerTextRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
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
  chipRow: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 14,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: '#F56E0F',
    borderColor: '#F56E0F',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 13, color: theme.colors.muted, fontWeight: '600' },
  list: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 8,
    paddingBottom: 130
  },
}));
